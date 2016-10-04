import { IController } from './icontroller';
import { IStickOptions } from './istick-options';

import { GeneralController } from './general-controller';
import { Joystick } from './joystick';

import { dragListener } from './drag-listener';
import { isMouseEvent, isTouchEvent, magnitude, sign, unitVector } from './util';

import { events } from './events';

import * as PIXI from 'pixi.js';


/****************************/
/*** The Stick Controller ***/
/****************************/
export class StickController extends GeneralController {

    /*******************/
    /*** Constructor ***/
    /*******************/
    constructor(x: number, y: number, options?: IStickOptions) {
        super(x, y, options);
    }

    protected _init() {
        this._joystick = new Joystick(0, 0, this._options); // ERR: x and y should be computed based on stick type, i.e. static/semi/dynamic
        this.addChild(this._joystick);
    }

    /**
     * TouchStart is fired by the PIXI InteractionManager, but because InteractionManager.processInteractive
     * does not keep a record of the recipient of TouchStart for a given touch, the StickController has its own
     * listener on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
     * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the original recipient of 
     * TouchStare so the StickController will not receive the TouchEnd event from the PIXI event system if the 
     * user's finger is not over the StickController when they release)
     **/
    protected _initEvents(mouseOrTouch: string) {
        // Touch Start
        this.on(events[mouseOrTouch].onTouchStart, (event: PIXI.interaction.InteractionEvent) => {
            this._processTouchStart(event);
        });

        // TouchMove
        if (!this._dragListener) this._dragListener = dragListener[this._options.axes];
        this._addWindowListener(events[mouseOrTouch].onTouchMove, (event: TouchEvent | MouseEvent) => {
            this._processTouchMove(event);
        });

        // Touch End
        this._addWindowListener(
            events[mouseOrTouch].onTouchEnd, (event: TouchEvent | MouseEvent) => {
                this._processTouchEnd(event);
            }
        );
    }
}