declare module "util" {
    import * as PIXI from 'pixi.js';
    export function magnitude(vec: PIXI.Point): number;
    export function unitVector(vec: PIXI.Point, outVec?: PIXI.Point): PIXI.Point;
    export function sign(value: number): number;
    export function isMouseEvent(event: MouseEvent | any): event is MouseEvent;
    export function isTouchEvent(event: TouchEvent | any): event is TouchEvent;
}
declare module "drag-listener" {
    /***********************/
    /*** Everything Else ***/
    /***********************/
    export interface IListenerDictionary {
        [key: string]: (event: Touch | MouseEvent) => void;
    }
    export const dragListener: IListenerDictionary;
}
declare module "events" {
    export interface IEventCategory {
        [key: string]: string;
        onTouchStart: string;
        onTouchMove: string;
        onTouchEnd: string;
        onTouchEndOutside: string;
    }
    export const events: {
        [eventType: string]: IEventCategory;
    };
}
declare module "istick-options" {
    import * as PIXI from 'pixi.js';
    export interface IStickOptions {
        [key: string]: any;
        touch?: boolean;
        mouse?: boolean;
        axes?: 'x' | 'y' | 'xy';
        type?: 'static' | 'semi' | 'dynamic';
        deadZone?: number;
        opacity?: number;
        nub?: PIXI.Sprite;
        nubSize?: number;
        well?: PIXI.Sprite;
        wellRadius?: number;
    }
    export default IStickOptions;
}
declare module "joystick" {
    import IStickOptions from "istick-options";
    import * as PIXI from 'pixi.js';
    /**
     * The graphical component. Contains no business logic (which is handled in StickController)
     */
    export class Joystick extends PIXI.Container {
        private _options;
        well: PIXI.Sprite | PIXI.Graphics;
        nub: PIXI.Sprite | PIXI.Graphics;
        constructor(x: number, y: number, options: IStickOptions);
        private _initGraphics();
    }
    export default Joystick;
}
declare module "icontroller" {
    export interface IController {
        emit: (eventString: string, event: any) => void;
        id: number;
        identifier: number;
    }
}
declare module "general-controller" {
    import { Joystick } from "joystick";
    import { IStickOptions } from "istick-options";
    import { IController } from "icontroller";
    import * as PIXI from 'pixi.js';
    /****************************/
    /*** The Stick Controller ***/
    /****************************/
    export abstract class GeneralController extends PIXI.Container implements IController {
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
}
declare module "stick-controller" {
    import { IStickOptions } from "istick-options";
    import { GeneralController } from "general-controller";
    /****************************/
    /*** The Stick Controller ***/
    /****************************/
    export class StickController extends GeneralController {
        /*******************/
        /*** Constructor ***/
        /*******************/
        constructor(x: number, y: number, options?: IStickOptions);
        protected _init(): void;
        /**
         * TouchStart is fired by the PIXI InteractionManager, but because InteractionManager.processInteractive
         * does not keep a record of the recipient of TouchStart for a given touch, the StickController has its own
         * listener on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
         * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the original recipient of
         * TouchStare so the StickController will not receive the TouchEnd event from the PIXI event system if the
         * user's finger is not over the StickController when they release)
         **/
        protected _initEvents(mouseOrTouch: string): void;
    }
}
declare module "stick-area-controller" {
    import { GeneralController } from "general-controller";
    import { IStickOptions } from "istick-options";
    import * as PIXI from 'pixi.js';
    export interface IStickAreaOptions extends IStickOptions {
        [key: string]: any;
        debug?: boolean;
    }
    export class StickAreaController extends GeneralController {
        protected _area: PIXI.Graphics;
        protected _options: IStickAreaOptions;
        /*******************/
        /*** Constructor ***/
        /*******************/
        constructor(x: number, y: number, width: number, height: number, options: IStickAreaOptions);
        protected _init(): void;
        protected _initEvents(mouseOrTouch: string): void;
        private _despawnStick();
        private _spawnStick(position);
    }
}
declare module "index" {
    import { StickController } from "stick-controller";
    import { StickAreaController } from "stick-area-controller";
    const pixiStick: {
        StickController: typeof StickController;
        StickAreaController: typeof StickAreaController;
    };
    export default pixiStick;
}
