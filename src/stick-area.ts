import { isMouseEvent, magnitude, sign, unitVector } from './util';

import Joystick from './joystick';

import IStickOptions from './IStickOptions';
import IController from './IController';

import events from './events';

import debug from './debug';

import { dragListener } from'./drag-listener';

export interface IStickAreaOptions extends IStickOptions {
    [key: string]: any;
    debug?: boolean;
}

function generateColor() {
    let color = 0;
    let primary = Math.floor(Math.random() * 3);

    for (let i = 0; i < 3; i++) {
        color = color << 8;
        color += 155 + Math.floor(Math.random() * 100);
    }

    return color;
}

/***********************/
/*** Event Listeners ***/
/***********************/
function dragListenerXY(event: PIXI.interaction.InteractionEvent) {
    if (event.data.identifier != this.identifier) return;

    if (this.isTouched) {
        this._joystick.toLocal(event.data.global, null, this._axes);

        if (magnitude(this._axes) > this._options.wellRadius) {
            unitVector(this._axes, this._axes);
            this._joystick.nub.x = this._axes.x * this._options.wellRadius;
            this._joystick.nub.y = this._axes.y * this._options.wellRadius;
        } else {
            this._joystick.nub.x = this._axes.x;
            this._joystick.nub.y = this._axes.y;
            this._axes.x /= this._options.wellRadius;
            this._axes.y /= this._options.wellRadius;
        }
    } else {
        this._axes.x = 0;
        this._axes.y = 0;
    }


    if (this.onTouchMove) {
        this.onTouchMove(this._axes);
    }

    if (this.onAxisChange) {
        this.onAxisChange(this._axes);
    }
}

function dragListenerX(event: PIXI.interaction.InteractionEvent) {
    if (!this.isTouched) {
        this._axes.x = 0;
        this._axes.y = 0;
        return;
    }

    this._touchData.getLocalPosition(this, this._axes);

    if (Math.abs(this._axes.x) > this._options.wellRadius) {
        this._axes.x = sign(this._axes.x);
        this._axes.y = 0;
        this._joystick.nub.x = this._axes.x * this._options.wellRadius;
        this._joystick.nub.y = 0;
    } else {
        this._joystick.nub.x = this._axes.x;
        this._joystick.nub.y = 0;
        this._axes.x /= this._options.wellRadius;
        this._axes.y = 0;
    }

    if (this.onTouchMove) {
        this.onTouchMove({ position: this._axes }); // GARBAGE
    }
}

function dragListenerY(event: PIXI.interaction.InteractionEvent) {
    if (!this.isTouched) {
        this._axes.x = 0;
        this._axes.y = 0;
        return;
    }

    this._axes.copy(this._touchData.getLocalPosition(this));

    if (Math.abs(this._axes.y) > this._options.wellRadius) {
        this._axes.x = 0
        this._axes.y = sign(this._axes.y);
        this._joystick.nub.x = 0
        this._joystick.nub.y = this._axes.y * this._options.wellRadius;
    } else {
        this._joystick.nub.x = 0
        this._joystick.nub.y = this._axes.y;
        this._axes.x = 0
        this._axes.y /= this._options.wellRadius;
    }

    if (this.onTouchMove) {
        this.onTouchMove(this._axes);
    }
}



export class StickArea extends PIXI.Graphics implements IController {

    private _id: number;
    get id() { return this._id; }
    set id(value: number) { if (!this._id) { this._id = value; } else { throw new Error('id is readonly'); } }

    private _options: IStickAreaOptions = {
        debug: false,

        mouse: true,
        touch: true,

        axes: 'xy',
        deadZone: 0, // TODO: Implement deadZone
        nub: null,
        nubSize: 0.3,
        well: null,
        wellRadius: 50,
    }

    private _joystick: Joystick;
    private _dragListener: (event: Touch | MouseEvent) => void;

    /** _axes is used as temporary storage for coordinates while they are being transformed.
     *  Without _axes, we would either need to either:
     * 
     *  1) Perform the same event.data.getLocalPosition() call multiple times per event (esp. dragListeners)
     *  2) Accumulate garbage by creating temporary PIXI.Point instances  (esp. dragListeners)
     *  3) Assign the localPosition back to the event.data, risking issues where we might accidentally perform
     *     the global -> local transformation multiple times
     */
    private _axes: PIXI.Point;
    /** Keeps track of eventListeners so they can be removed from the window on dispose() */
    private _registeredEventListeners: [string, (event: TouchEvent | MouseEvent) => void][];

    public isTouched: boolean = false;
    public identifier: number;


    /**************/
    /*** Events ***/
    /**************/

    /** Fires when the stick is touched */
    public onTouchStart: (axes: PIXI.Point) => void;

    /** Fires when the touch moves */
    public onTouchMove: (axes: PIXI.Point) => void;

    /** Fires when the stick is no longer touched */
    public onTouchEnd: (axes: PIXI.Point) => void;

    /** Fires when the stick is tapped (Configurable. See IStickOptions) */
    public onTap: (axes: PIXI.Point) => void;

    /** Fires ANY TIME any axis changes */
    public onAxisChange: (axes: PIXI.Point) => void;


    /*******************/
    /*** Constructor ***/
    /*******************/
    constructor(x: number, y: number, width: number, height: number, options: IStickAreaOptions) {
        super();

        this._axes = new PIXI.Point(0, 0);
        this._registeredEventListeners = [];

        this.x = x;
        this.y = y;

        if (options) {
            for (let prop in options) {
                if (options.hasOwnProperty(prop)) {
                    this._options[prop] = options[prop];
                }
            }
        }

        this.interactive = true;

        this._initGraphics(width, height);
        this._joystick = new Joystick(0, 0, this._options);

        if (this._options.mouse) this._initEvents('mouse');
        if (this._options.touch) this._initEvents('touch');
    }

    private _initGraphics(width: number, height: number) {
        this.beginFill(generateColor(), this._options.debug ? 0.7 : 0);
        this.drawRect(0, 0, width, height);
        this.endFill();
    }

    private _initEvents(mouseOrTouch: string) {
        // Touch Start
        this.on(events[mouseOrTouch].onTouchStart, (event: PIXI.interaction.InteractionEvent) => {
            this.identifier = event.data.identifier;
            this._spawnStick(event.data.getLocalPosition(this));
            this.isTouched = true;
            if (this.onTouchStart) this.onTouchStart(this._axes);
            event.stopPropagation();
        });

        // Touch Drag
        // Store this eventlistener for removal later
        // TODO: HOLY HELL DO I NOT NEED TO BIND DRAGLISTNERE?!?!?!!?!??!?
        if (!this._dragListener) this._dragListener = dragListener[this._options.axes];
        this._registeredEventListeners.push([
            events[mouseOrTouch].onTouchMove, (event: TouchEvent | MouseEvent) => {
                if (isMouseEvent(event)) {
                    if (this.isTouched) this._dragListener(event);
                }
                else {
                    for (let i = 0; i < event.changedTouches.length; i++) {
                        if (event.changedTouches[i].identifier === this.identifier) {
                            this._dragListener(event.changedTouches[i]);
                            break;
                        }
                    }
                }
            }
        ])
        // add the event listener to the window
        window.addEventListener(events[mouseOrTouch].onTouchMove, this._registeredEventListeners[this._registeredEventListeners.length - 1][1]);


        // Touch End
        // Store this eventlistener for removal later
        this._registeredEventListeners.push([
            events[mouseOrTouch].onTouchEnd, (event: TouchEvent | MouseEvent) => {
                if (isMouseEvent(event)) { // if it's a mouseEvent
                    this.identifier = undefined;
                    this.isTouched = false;
                    this.resetPosition();
                    this.onAxisChange(this._axes);
                    this._despawnStick();

                    event.stopPropagation();
                } else { // Else if it's a touchEvent
                    for (let i = 0; i < event.changedTouches.length; i++) {
                        if (event.changedTouches[i].identifier === this.identifier) {
                            this.identifier = undefined;
                            this.isTouched = false;
                            this.resetPosition();
                            this.onAxisChange(this._axes);
                            this._despawnStick();

                            event.stopPropagation();
                            break;
                        }
                    }
                }
            }]);
        // add the event listener to the window
        window.addEventListener(events[mouseOrTouch].onTouchEnd, this._registeredEventListeners[this._registeredEventListeners.length - 1][1]);

    }

    private _despawnStick() {
        debug.log('despawning stick', this);
        this.removeChild(this._joystick);
    }

    public dispose() {
        this._registeredEventListeners.forEach(
            (arr: [string, (event: TouchEvent | MouseEvent) => void]) => {
                window.removeEventListener(arr[0], arr[1]);
            }
        );
    }

    public resetPosition() {
        this._joystick.nub.x = 0;
        this._joystick.nub.y = 0;

        this._axes.x = 0;
        this._axes.y = 0;
    }

    private _spawnStick(position: PIXI.Point) {
        debug.log('spawning stick at [' + position.x + ',' + position.y + ']', this);
        this.addChild(this._joystick);
        this._joystick.x = position.x;
        this._joystick.y = position.y;
        this._joystick.isTouched = true;
    }
}

export default StickArea;