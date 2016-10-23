import { Joystick } from './joystick';
import { IStickOptions } from './istick-options';
import { IController } from './icontroller';

import { isMouseEvent, magnitude, sign, unitVector } from './util';
import { events } from './events';
import { dragListener } from './drag-listener';

import * as PIXI from 'pixi.js';


/****************************/
/*** The Stick Controller ***/
/****************************/
export abstract class GeneralController extends PIXI.Container implements IController {

    protected _id: number;
    get id() { return this._id; }
    set id(value: number) { if (!this._id) { this._id = value; } else { throw new Error('id is readonly'); } }

    protected _options: IStickOptions = {
        touch: true,
        mouse: true,

        axes: 'xy',
        deadZone: 0, // TODO: Implement deadZone
        nub: null,
        nubSize: 0.3,
        well: null,
        wellRadius: 50,
    };

    protected _joystick: Joystick;
    protected _dragListener: (event: Touch | MouseEvent) => void;

    /** _axes is used as temporary storage for coordinates while they are being transformed.
     *  Without _axes, we would either need to either:
     * 
     *  1) Perform the same event.data.getLocalPosition() call multiple times per event (esp. dragListeners)
     *  2) Accumulate garbage by creating temporary PIXI.Point instances  (esp. dragListeners)
     *  3) Assign the localPosition back to the event.data, risking issues where we might accidentally perform
     *     the global -> local transformation multiple times
     */
    protected _axes: PIXI.Point;
    /** Keeps track of eventListeners so they can be removed from the window on dispose() */
    protected _registeredEventListeners: [string, (event: TouchEvent | MouseEvent) => void][];

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

        this._init();

        if (this._options.mouse) this._initEvents('mouse');
        if (this._options.touch) this._initEvents('touch');
    }

    protected abstract _init(): void;

    protected abstract _initEvents(mouseOrTouch: string): void;

    /** Adds a listener to the window and keeps a reference to it so the listener can be removed via dispose() */
    protected _addWindowListener(eventString: string, func: (event: TouchEvent | MouseEvent) => void) {
        this._registeredEventListeners.push([eventString, func]);
        window.addEventListener(eventString, func);
    }


    /**
     * TouchStart is fired by the PIXI InteractionManager, but because InteractionManager.processInteractive
     * does not keep a record of the recipient of TouchStart for a given touch, the StickController has its own
     * listeners on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
     * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the original recipient of 
     * TouchStart so the StickController will not receive the TouchEnd event from the PIXI event system if the 
     * user's finger is not over the StickController when they release)
     **/


    protected _processTouchStart(event: PIXI.interaction.InteractionEvent) {
        this.identifier = event.data.identifier;
        this.isTouched = true;

        if (isMouseEvent(event.data.originalEvent)) {
            this._dragListener(<MouseEvent>event.data.originalEvent)
        } else {
            this._dragListener((<TouchEvent>event.data.originalEvent).changedTouches[event.data.identifier])
        };

        if (this.onTouchStart) this.onTouchStart(this._axes);
        return true;
    }

    protected _processTouchMove(event: TouchEvent | MouseEvent) {
        if (isMouseEvent(event)) {
            if (this.isTouched) this._dragListener(event);
            return true;
        } else {
            for (let i = 0; i < event.changedTouches.length; i++) {
                if (event.changedTouches[i].identifier === this.identifier) {
                    this._dragListener(event.changedTouches[i]);
                    return true;
                }
            }
        }
        return false;
    }

    protected _processTouchEnd(event: TouchEvent | MouseEvent) {
        if (isMouseEvent(event)) { // if it's a mouseEvent
            this.identifier = undefined;
            this.isTouched = false;
            this.resetPosition();
            this.onAxisChange(this._axes);

            event.stopPropagation();
            return true;
        } else { // Else if it's a touchEvent
            for (let i = 0; i < event.changedTouches.length; i++) {
                if (event.changedTouches[i].identifier === this.identifier) {
                    this.identifier = undefined;
                    this.isTouched = false;
                    this.resetPosition();
                    this.onAxisChange(this._axes);

                    event.stopPropagation();
                    return true;
                }
            }
        }
        return false;
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