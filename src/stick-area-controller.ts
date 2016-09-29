import { Joystick } from './joystick';
import { GeneralController } from './general-controller';

import { IStickOptions } from './istick-options';
import { IController } from './icontroller';

import { dragListener } from './drag-listener';
import { isMouseEvent, magnitude, sign, unitVector } from './util';

import { events } from './events';

import * as PIXI from 'pixi.js';

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


export class StickAreaController extends GeneralController {

    protected _area: PIXI.Graphics;

    protected _options: IStickAreaOptions = {
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

    /*******************/
    /*** Constructor ***/
    /*******************/
    constructor(x: number, y: number, width: number, height: number, options: IStickAreaOptions) {
        super(x, y, options);

        if (options) {
            for (let prop in options) {
                if (options.hasOwnProperty(prop)) {
                    this._options[prop] = options[prop];
                }
            }
        }

        this._area = new PIXI.Graphics();
        this._area.beginFill(generateColor(), this._options.debug ? 0.7 : 0);
        this._area.drawRect(0, 0, width, height);
        this._area.endFill();

        this.addChild(this._area);
    }

    protected _init() {
        this._joystick = new Joystick(0, 0, this._options);
    }

    protected _initEvents(mouseOrTouch: string) {
        // Touch Start
        this.on(events[mouseOrTouch].onTouchStart, (event: PIXI.interaction.InteractionEvent) => {
            this._spawnStick(event.data.getLocalPosition(this));
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
                if (this._processTouchEnd(event)) {
                    this._despawnStick();
                }
            }
        );
    }

    private _despawnStick() {
        this._area.removeChild(this._joystick);
    }

    private _spawnStick(position: PIXI.Point) {
        this._area.addChild(this._joystick);
        this._joystick.x = position.x;
        this._joystick.y = position.y;
    }
}