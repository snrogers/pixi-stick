import { Joystick } from './joystick';
import { IStickOptions } from './istick-options';
import { IController } from './icontroller';
import * as PIXI from 'pixi.js';
/****************************/
/*** The Stick Controller ***/
/****************************/
export declare abstract class GeneralController extends PIXI.Container implements IController {
    protected _id: number;
    id: number;
    protected _options: IStickOptions;
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
    isTouched: boolean;
    identifier: number;
    /**************/
    /*** Events ***/
    /**************/
    /** Fires when the stick is touched */
    onTouchStart: (axes: PIXI.Point) => void;
    /** Fires when the touch moves */
    onTouchMove: (axes: PIXI.Point) => void;
    /** Fires when the stick is no longer touched */
    onTouchEnd: (axes: PIXI.Point) => void;
    /** Fires when the stick is tapped (Configurable. See IStickOptions) */
    /** Fires ANY TIME any axis changes */
    onAxisChange: (axes: PIXI.Point) => void;
    /*******************/
    /*** Constructor ***/
    /*******************/
    constructor(x: number, y: number, options?: IStickOptions);
    protected abstract _init(): void;
    protected abstract _initEvents(mouseOrTouch: string): void;
    /** Adds a listener to the window and keeps a reference to it so the listener can be removed via dispose() */
    protected _addWindowListener(eventString: string, func: (event: TouchEvent | MouseEvent) => void): void;
    /**
     * TouchStart is fired by the PIXI InteractionManager, but because InteractionManager.processInteractive
     * does not keep a record of the recipient of TouchStart for a given touch, the StickController has its own
     * listener on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
     * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the original recipient of
     * TouchStare so the StickController will not receive the TouchEnd event from the PIXI event system if the
     * user's finger is not over the StickController when they release)
     **/
    protected _processTouchStart(event: PIXI.interaction.InteractionEvent): boolean;
    protected _processTouchMove(event: TouchEvent | MouseEvent): boolean;
    protected _processTouchEnd(event: TouchEvent | MouseEvent): boolean;
    dispose(): void;
    resetPosition(): void;
}
