import { isMouseEvent, magnitude, sign, unitVector } from './util';

import Joystick from './joystick';

import IStickOptions from './IStickOptions';
import IController from './IController';

import events from './events';

import debug from './debug';

import { transformManager } from'./transformManager.ts';

import { dragListener } from './drag-listener';


/****************************/
/*** The Stick Controller ***/
/****************************/
export class StickController extends PIXI.Container implements IController {

    private _id: number;
    get id() { return this._id; }
    set id(value: number) { if (!this._id) { this._id = value; } else { throw new Error('id is readonly'); } }

    private _options: IStickOptions = {
        touch: true,
        mouse: true,

        axes: 'xy',
        deadZone: 0, // TODO: Implement deadZone
        nub: null,
        nubSize: 0.3,
        well: null,
        wellRadius: 50,
    };

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
    // public onTap: (axes: PIXI.Point) => void;

    /** Fires ANY TIME any axis changes */
    public onAxisChange: (axes: PIXI.Point) => void;


    /*******************/
    /*** Constructor ***/
    /*******************/
    constructor(x: number, y: number, options?: IStickOptions) {
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

        this._joystick = new Joystick(0, 0, this._options); // ERR: x and y should be computed based on stick type, i.e. static/semi/dynamic
        this.addChild(this._joystick);

        if (this._options.mouse) this._initEvents('mouse');
        if (this._options.touch) this._initEvents('touch');
    }

    /**
     * TouchStart is fired by the PIXI InteractionManager, but because InteractionManager.processInteractive
     * does not keep a record of the recipient of TouchStart for a given touch, the StickController has its own
     * listener on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
     * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the originator so the StickController
     * will not receive the TouchEnd event if the user's finger is not over the StickController when they release)
     **/
    private _initEvents(mouseOrTouch: string) {
        console.log(events[mouseOrTouch]);

        // Touch Start
        this.on(events[mouseOrTouch].onTouchStart, (event: PIXI.interaction.InteractionEvent) => {
            this.identifier = event.data.identifier;
            this.isTouched = true;
            if (this.onTouchStart) this.onTouchStart(this._axes);
            event.stopPropagation();
        });

        // Touch Drag
        // Store this eventlistener for removal later
        if (!this._dragListener) this._dragListener = dragListener[this._options.axes];
        this._addWindowListener(events[mouseOrTouch].onTouchMove, (event: TouchEvent | MouseEvent) => {
            if (isMouseEvent(event)) {
                if (this.isTouched) this._dragListener(event);
            } else {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    if (event.changedTouches[i].identifier === this.identifier) {
                        this._dragListener(event.changedTouches[i]);
                        break;
                    }
                }
            }
        });

        // Touch End
        // Store this eventlistener for removal later
        this._addWindowListener(
            events[mouseOrTouch].onTouchEnd, (event: TouchEvent | MouseEvent) => {
                if (isMouseEvent(event)) { // if it's a mouseEvent
                    this.identifier = undefined;
                    this.isTouched = false;
                    this.resetPosition();
                    this.onAxisChange(this._axes);

                    event.stopPropagation();
                } else { // Else if it's a touchEvent
                    for (let i = 0; i < event.changedTouches.length; i++) {
                        if (event.changedTouches[i].identifier === this.identifier) {
                            this.identifier = undefined;
                            this.isTouched = false;
                            this.resetPosition();
                            this.onAxisChange(this._axes);

                            event.stopPropagation();
                            break;
                        }
                    }
                }
            });
    }

    /** Adds a listener to the window and keeps a reference to it so the listener can be removed via dispose() */
    private _addWindowListener(eventString: string, func: (event: TouchEvent | MouseEvent) => void) {
        this._registeredEventListeners.push([eventString, func]);
        window.addEventListener(eventString, func);
    }


    // Removes all window eventlisteners that this instance has registered
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
}

export default StickController;