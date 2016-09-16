import { magnitude, sign, unitVector } from './util';

import Joystick from './joystick';
import ControllableStage from './controllable-stage';

import IStickOptions from './IStickOptions';
import IController from './IController';

import events from './events';

import debug from './debug';

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

    /**
     * TODO: Investigate the possibility of eliminating this._axes.
     * Using this.toLocal might have eliminated the need for this._axes.
     */

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

    private _stage: ControllableStage;
    get stage() { throw new Error('Someone apparently needs the stage?!?'); }
    set stage(value: ControllableStage) { if (!this._stage) { this._stage = value; } else { throw new Error('stage is readonly'); } }

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
    private _dragListener: (event: PIXI.interaction.InteractionEvent) => void;

    /** _axes is used as temporary storage for coordinates while they are being transformed.
     *  Without _axes, we would either need to either:
     * 
     *  1) Perform the same event.data.getLocalPosition() call multiple times per event (esp. dragListeners)
     *  2) Accumulate garbage by creating temporary PIXI.Point instances  (esp. dragListeners)
     *  3) Assign the localPosition back to the event.data, risking issues where we might accidentally perform
     *     the global -> local transformation multiple times
     */

    private _axes: PIXI.Point;

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

        if (options) {
            for (let prop in options) {
                if (options.hasOwnProperty(prop)) {
                    this._options[prop] = options[prop];
                }
            }
        }

        this._axes = new PIXI.Point(0, 0);

        this.x = x;
        this.y = y;
        this.interactive = true;

        this._initGraphics(width, height);
        if (this._options.mouse) this._initEvents('mouse');
        if (this._options.touch) this._initEvents('touch');

        this._joystick = new Joystick(0, 0, this._options);
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
            this._dragListener(event);

            event.stopPropagation();
        });

        // Touch Drag
        switch (this._options.axes) {
            case 'xy':
                this._dragListener = dragListenerXY.bind(this);
                break;
            case 'x':
                this._dragListener = dragListenerX.bind(this);
                break;
            case 'y':
                this._dragListener = dragListenerY.bind(this);
                break;
            default:
                throw new Error(this._options.type + ' is not a valid stick type');
        }
        this.on(events[mouseOrTouch].onTouchMove, function (event: PIXI.interaction.InteractionData) {
            // debug.log('Touch Move', this);
            this._dragListener(event);
        }); // TODO: Remove debug wrapper


        // Touch End
        this.on(events[mouseOrTouch].onTouchEnd, (event: PIXI.interaction.InteractionEvent) => {
            if (event.data.identifier !== this.identifier) return;

            this.identifier = undefined;
            this.isTouched = false;
            this.resetPosition();
            this.onAxisChange(this._axes);
            this._despawnStick();

            event.stopPropagation();
        });
        this.on(events[mouseOrTouch].onTouchEndOutside, (event: PIXI.interaction.InteractionEvent) => {
            if (event.data.identifier !== this.identifier) return;

            this.identifier = undefined;
            this.isTouched = false;
            this.resetPosition();
            this.onAxisChange(this._axes);
            this._despawnStick();

            event.stopPropagation();
        });
    }

    private _despawnStick() {
        debug.log('despawning stick', this);
        this.removeChild(this._joystick);
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