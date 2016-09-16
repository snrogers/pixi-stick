import { magnitude, sign, unitVector } from './util';

import Joystick from './joystick';
import ControllableStage from './controllable-stage';

import IStickOptions from './IStickOptions';
import IController from './IController';

import events from './events';

import debug from './debug';


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
    if (event.data.identifier != this.identifier) return;

    /**
     * TODO: Investigate the possibility of eliminating this._axes.
     * Using this.toLocal might have eliminated the need for this._axes.
     */

    if (this.isTouched) {
        this._joystick.toLocal(event.data.global, null, this._axes);

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

function dragListenerY(event: PIXI.interaction.InteractionEvent) {
    if (event.data.identifier != this.identifier) return;

    /**
     * TODO: Investigate the possibility of eliminating this._axes.
     * Using this.toLocal might have eliminated the need for this._axes.
     */

    if (this.isTouched) {
        this._joystick.toLocal(event.data.global, null, this._axes);

        if (Math.abs(this._axes.y) > this._options.wellRadius) {
            this._axes.x = 0;
            this._axes.y = sign(this._axes.y);
            this._joystick.nub.x = 0;
            this._joystick.nub.y = this._axes.y * this._options.wellRadius;
        } else {
            this._joystick.nub.x = 0;
            this._joystick.nub.y = this._axes.y;
            this._axes.x = 0;
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

/****************************/
/*** The Stick Controller ***/
/****************************/
export class StickController extends PIXI.Container implements IController {

    private _id: number;
    get id() { return this._id; }
    set id(value: number) { if (!this._id) { this._id = value; } else { throw new Error('id is readonly'); } }

    private _stage: ControllableStage;
    get stage() { throw new Error('Someone apparently needs the stage?!?'); }
    set stage(value: ControllableStage) { if (!this._stage) { this._stage = value; } else { throw new Error('stage is readonly'); } }

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
    constructor(x: number, y: number, options?: IStickOptions) {
        super();

        this._axes = new PIXI.Point(0, 0);

        this.x = x;
        this.y = y;

        if (options) {
            for (let prop in options) {
                if (options.hasOwnProperty(prop)) {
                    this._options[prop] = options[prop];
                }
            }
        }

        // Set dimensions
        if (this._options.type === 'static') {
            this.width = this._options.wellRadius * 2;
            this.height = this._options.wellRadius * 2;
        }

        this.interactive = true;

        this._joystick = new Joystick(0, 0, this._options); // ERR: x and y should be computed based on stick type, i.e. static/semi/dynamic
        this.addChild(this._joystick);

        if (this._options.mouse) this._initEvents('mouse');
        if (this._options.touch) this._initEvents('touch');
    }

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
        this.on(events[mouseOrTouch].onTouchMove, this._dragListener); // TODO: Remove debug wrapper


        // Touch End
        this.on(events[mouseOrTouch].onTouchEnd, (event: PIXI.interaction.InteractionEvent) => {
            if (event.data.identifier !== this.identifier) return;

            this.identifier = undefined;
            this.isTouched = false;
            this.resetPosition();
            this.onAxisChange(this._axes);

            event.stopPropagation();
        });
        this.on(events[mouseOrTouch].onTouchEndOutside, (event: PIXI.interaction.InteractionEvent) => {
            if (event.data.identifier !== this.identifier) return;

            this.identifier = undefined;
            this.isTouched = false;
            this.resetPosition();
            this.onAxisChange(this._axes);

            event.stopPropagation();
        });
    }

    public resetPosition() {
        this._joystick.nub.x = 0;
        this._joystick.nub.y = 0;

        this._axes.x = 0;
        this._axes.y = 0;
    }
}

export default StickController;