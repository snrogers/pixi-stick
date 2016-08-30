import { magnitude, sign, unitVector } from './util';

export interface IStickEvent {
    position: PIXI.Point
}

export interface IStickOptions {
    [key: string]: any;
    type?: 'x' | 'y' | 'xy';
    nub?: PIXI.Container;
    nubSize?: number;
    pollable?: boolean;
    well?: PIXI.Container;
    wellRadius?: number;
}

const mouseEvents = {
    onTouchStart: 'mousedown',
    onTouchMove: 'mousemove',
    onTouchEnd: 'mouseup',
    onTouchEndOutside: 'mouseupoutside'
}


function dragListenerXY(event: PIXI.interaction.InteractionEvent) {
    if (event.data.identifier != this._touchIdentifier) return;

    if (!this.isTouched) {
        this._axes.x = 0;
        this._axes.y = 0;
        return;
    }

    window.touchData = this._touchData;
    window.eventData = event.data;

    event.data.getLocalPosition(this, this._axes);

    if (magnitude(this._axes) > this._options.wellRadius) {
        unitVector(this._axes, this._axes);
        this._nub.x = this._axes.x * this._options.wellRadius;
        this._nub.y = this._axes.y * this._options.wellRadius;
    } else {
        this._nub.x = this._axes.x;
        this._nub.y = this._axes.y;
        this._axes.x /= this._options.wellRadius;
        this._axes.y /= this._options.wellRadius;
    }

    if (this.onTouchMove) {
        this.onTouchMove({ position: this._axes }); // GARBAGE
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
        this._nub.x = this._axes.x * this._options.wellRadius;
        this._nub.y = 0;
    } else {
        this._nub.x = this._axes.x;
        this._nub.y = 0;
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
        this._nub.x = 0
        this._nub.y = this._axes.y * this._options.wellRadius;
    } else {
        this._nub.x = 0
        this._nub.y = this._axes.y;
        this._axes.x = 0
        this._axes.y /= this._options.wellRadius;
    }

    if (this.onTouchMove) {
        this.onTouchMove({ position: this._axes }); // GARBAGE
    }
}

export class Stick extends PIXI.Container {

    private _options: IStickOptions = {
        deadZone: 0, // TODO: Implement deadZone
        nub: null,
        nubSize: 0.3,
        well: null,
        wellRadius: 50,
        type: 'xy'   // TODO: Implement type
    };

    private _well: PIXI.Container;
    private _nub: PIXI.Container;

    private _mouseDragListener: (event: PIXI.interaction.InteractionEvent) => void;

    private _axes: PIXI.Point;
    private _touchIdentifier: number;

    public isTouched: boolean = false;

    // Events

    /** Fires when the stick is touched */
    public onTouchStart: (event: IStickEvent) => void;

    /** Fires when the touch moves */
    public onTouchMove: (event: IStickEvent) => void;

    /** Fires when the stick is no longer touched */
    public onTouchEnd: (event: IStickEvent) => void;

    /** Fires when the stick is tapped (Configurable. See IOptions) */
    public onTap: (event: IStickEvent) => void;

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

        this.interactive = true;

        this._initGraphics();
        this._initMouseEvents();
        this._initTouchEvents();
    }

    private _initGraphics() {

        // Init Well
        if (this._options.well) {
            this._well = this._options.well;
            this._well.width = this._options.wellRadius * 2;
            this._well.height = this._options.wellRadius * 2;

            // TODO: Anchor only works on Sprite, not Container. Should add a nubOffset property to deal with this
            this._well.anchor.x = 0.5;
            this._well.anchor.y = 0.5;

        } else {
            this._well = new PIXI.Graphics();
            switch (this._options.type) {
                case 'xy':
                    (<PIXI.Graphics>this._well).beginFill(0xffffff, 0.25);
                    (<PIXI.Graphics>this._well).drawShape(new PIXI.Circle(0, 0, this._options.wellRadius));
                    (<PIXI.Graphics>this._well).endFill();
                    break;
                case 'x':
                    (<PIXI.Graphics>this._well).beginFill(0xffffff, 0.25);
                    (<PIXI.Graphics>this._well).drawShape(new PIXI.RoundedRectangle(
                        -this._options.wellRadius - this._options.wellRadius * this._options.nubSize,
                        -(this._options.wellRadius * this._options.nubSize),
                        this._options.wellRadius * 2 + this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * 2 * this._options.nubSize
                        ,
                        this._options.wellRadius * this._options.nubSize
                    ));
                    (<PIXI.Graphics>this._well).endFill();
                    break;
                case 'y':
                    (<PIXI.Graphics>this._well).beginFill(0xffffff, 0.25);
                    (<PIXI.Graphics>this._well).drawShape(new PIXI.RoundedRectangle(
                        -(this._options.wellRadius * this._options.nubSize),
                        -this._options.wellRadius - this._options.wellRadius * this._options.nubSize,
                        this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * 2 + this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * this._options.nubSize
                    ));
                    (<PIXI.Graphics>this._well).endFill();
                    break;
                default:
                    throw new Error(this._options.type + ' is not a valid stick type');
            }
        }

        this.addChild(this._well);




        // Init Nub
        if (this._options.nub) {
            this._nub = this._options.nub;
            this._nub.width = this._options.wellRadius * this._options.nubSize * 2;
            this._nub.height = this._options.wellRadius * this._options.nubSize * 2;

            // TODO: Anchor only works on Sprite, not Container. Should add a nubOffset property to deal with this
            this._nub.anchor.x = 0.5;
            this._nub.anchor.y = 0.5;
        } else {
            this._nub = new PIXI.Graphics();
            (<PIXI.Graphics>this._nub).beginFill(0xffffff, 0.25);
            (<PIXI.Graphics>this._nub).drawShape(new PIXI.Circle(0, 0, this._options.wellRadius * this._options.nubSize));
            (<PIXI.Graphics>this._nub).endFill();
        }
        this.addChild(this._nub);
    }

    private _initMouseEvents() {
        this.on('mousedown', (event: PIXI.interaction.InteractionEvent) => {
            this.isTouched = true;
        });

        switch (this._options.type) {
            case 'xy':
                this.on('mousemove', dragListenerXY.bind(this));
                break;
            case 'x':
                this.on('mousemove', dragListenerX.bind(this));
                break;
            case 'y':
                this.on('mousemove', dragListenerY.bind(this));
                break;
            default:
                throw new Error(this._options.type + ' is not a valid stick type');
        }

        this.on('mouseup', (event: PIXI.interaction.InteractionEvent) => {
            this.isTouched = false;
            this.resetPosition();
        });
        this.on('mouseupoutside', (event: PIXI.interaction.InteractionEvent) => {
            this.isTouched = false;
            this.resetPosition();
        });
    }

    private _initTouchEvents() {
        this.on('touchstart', (event: PIXI.interaction.InteractionEvent) => {
            this._touchIdentifier = event.data.identifier;
            this.isTouched = true;
        });

        switch (this._options.type) {
            case 'xy':
                this.on('touchmove', dragListenerXY.bind(this));
                break;
            case 'x':
                this.on('touchmove', dragListenerX.bind(this));
                break;
            case 'y':
                this.on('touchmove', dragListenerY.bind(this));
                break;
            default:
                throw new Error(this._options.type + ' is not a valid stick type');
        }

        this.on('touchend', (event: PIXI.interaction.InteractionEvent) => {
            this.isTouched = false;
            this.resetPosition();
        });
        this.on('touchendoutside', (event: PIXI.interaction.InteractionEvent) => {
            this.isTouched = false;
            this.resetPosition();
        });
    }

    public poll(): PIXI.Point {
        return this._axes;
    }

    public resetPosition() {
        this._nub.x = 0;
        this._nub.y = 0;

        this._axes.x = 0;
        this._axes.y = 0;
    }
}