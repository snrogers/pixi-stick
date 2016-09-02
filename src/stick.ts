import { magnitude, sign, unitVector } from './util';

/******************/
/*** Interfaces ***/
/******************/

export interface IStickOptions {
    [key: string]: any;

    touch?: boolean;
    mouse?: boolean;

    type?: 'x' | 'y' | 'xy';

    deadZone?: number; // TODO: Implement deadZone

    nub?: PIXI.Container;
    nubSize?: number;

    well?: PIXI.Container;
    wellRadius?: number;
}

interface IEventNames {
    onTouchStart: string;
    onTouchMove: string;
    onTouchEnd: string;
    onTouchEndOutside: string;
}



/*******************/
/*** Event Names ***/
/*******************/
const events: { [eventType: string]: IEventNames } = {
    mouse: {
        onTouchStart: 'mousedown',
        onTouchMove: 'mousemove',
        onTouchEnd: 'mouseup',
        onTouchEndOutside: 'mouseupoutside'
    },
    touch: {
        onTouchStart: 'touchstart',
        onTouchMove: 'touchmove',
        onTouchEnd: 'touchend',
        onTouchEndOutside: 'touchendoutside'
    }
}



/***********************/
/*** Event Listeners ***/
/***********************/
function dragListenerXY(event: PIXI.interaction.InteractionEvent) {
    if (event.data.identifier != this._touchIdentifier) return;

    if (this.isTouched) {
        this._axes = event.data.getLocalPosition(this, this._axes);

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
        this.onTouchMove(this._axes);
    }
}

/*****************/
/*** The Stick ***/
/*****************/
export class Stick extends PIXI.Container {

    private _options: IStickOptions = {
        touch: true,
        mouse: true,

        type: 'xy',

        deadZone: 0, // TODO: Implement deadZone

        nub: null,
        nubSize: 0.3,
        well: null,
        wellRadius: 50,
    };

    private _well: PIXI.Container;
    private _nub: PIXI.Container;

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
    private _touchIdentifier: number;

    public isTouched: boolean = false;



    /**************/
    /*** Events ***/
    /**************/

    /** Fires when the stick is touched */
    public onTouchStart: (axes: PIXI.Point) => void;

    /** Fires when the touch moves */
    public onTouchMove: (axes: PIXI.Point) => void;

    /** Fires when the stick is no longer touched */
    public onTouchEnd: (axes: PIXI.Point) => void;

    /** Fires when the stick is tapped (Configurable. See IOptions) */
    public onTap: (axes: PIXI.Point) => void;

    /** Fires ANY TIME any axis changes */
    public onAxisChange: (axes: PIXI.Point) => void;

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
        if (this._options.mouse) this._initEvents('mouse');
        if (this._options.touch) this._initEvents('touch');
    }

    private _initGraphics() {

        // Init Well
        if (this._options.well) {
            this._well = this._options.well;
            this._well.width = this._options.wellRadius * 2;
            this._well.height = this._options.wellRadius * 2;

            // TODO: Anchor only works on Sprite, not Container. Should add a wellAnchor property to deal with this
            this._well.anchor.x = 0.5;
            this._well.anchor.y = 0.5;

        } else {
            this._well = new PIXI.Graphics();
            switch (this._options.type) {
                case 'xy':
                    (<PIXI.Graphics>this._well).beginFill(0xffffff, 0.25);
                    (<PIXI.Graphics>this._well).drawCircle(0, 0, this._options.wellRadius);
                    (<PIXI.Graphics>this._well).endFill();
                    break;
                case 'x':
                    (<PIXI.Graphics>this._well).beginFill(0xffffff, 0.25);
                    (<PIXI.Graphics>this._well).drawRoundedRect(
                        -this._options.wellRadius - this._options.wellRadius * this._options.nubSize,
                        -(this._options.wellRadius * this._options.nubSize),
                        this._options.wellRadius * 2 + this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * 2 * this._options.nubSize
                        ,
                        this._options.wellRadius * this._options.nubSize
                    );
                    (<PIXI.Graphics>this._well).endFill();
                    break;
                case 'y':
                    (<PIXI.Graphics>this._well).beginFill(0xffffff, 0.25);
                    (<PIXI.Graphics>this._well).drawRoundedRect(
                        -(this._options.wellRadius * this._options.nubSize),
                        -this._options.wellRadius - this._options.wellRadius * this._options.nubSize,
                        this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * 2 + this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * this._options.nubSize
                    );
                    (<PIXI.Graphics>this._well).endFill();
                    break;
                default:
                    throw new Error(this._options.type + ' is not a valid stick type');
            }
        }


        // Init Nub
        if (this._options.nub) {
            this._nub = this._options.nub;
            this._nub.width = this._options.wellRadius * this._options.nubSize * 2;
            this._nub.height = this._options.wellRadius * this._options.nubSize * 2;

            // TODO: Anchor only works on Sprite, not Container. Should add a nubAnchor property to deal with this
            this._nub.anchor.x = 0.5;
            this._nub.anchor.y = 0.5;
        } else {
            this._nub = new PIXI.Graphics();
            (<PIXI.Graphics>this._nub).beginFill(0xffffff, 0.25);
            (<PIXI.Graphics>this._nub).drawCircle(0, 0, this._options.wellRadius * this._options.nubSize);
            (<PIXI.Graphics>this._nub).endFill();
        }

        // Add children
        this.addChild(this._well);
        this.addChild(this._nub);


        // // TODO: Remove this if it doesn't fix flickering background issue'
        // if (!this._options.nub && !this._options.well) {
        //     this.renderWebGL = (renderer: PIXI.WebGLRenderer) => {
        //         // this._nub.clear();
        //         // this._well.clear();
        //         super.renderWebGL(renderer)
        //     };
        //     this.renderCanvas = (renderer: PIXI.CanvasRenderer) => {
        //         // this._nub.clear();
        //         // this._well.clear();
        //         super.renderCanvas(renderer)
        //     };
        // } else if (!this._options.nub && !this._options.well) {
        //     throw new Error('unimplemented');
        // } else if (!this._options.nub && !this._options.well) {
        //     throw new Error('unimplemented');
        // }

    }

    private _initEvents(mouseOrTouch: string) {
        console.debug('initializing touch events');
        console.log(events[mouseOrTouch]);

        // Touch Start
        this.on(events[mouseOrTouch].onTouchStart, (event: PIXI.interaction.InteractionEvent) => {
            console.debug('touch start');
            this._touchIdentifier = event.data.identifier;
            this.isTouched = true;
            if (this.onTouchStart) this.onTouchStart(this._axes);
            this._dragListener(event);
        });

        // Touch Drag
        switch (this._options.type) {
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
        this.on(events[mouseOrTouch].onTouchMove, this._dragListener); // TODO: Remove wrapper


        // Touch End
        this.on(events[mouseOrTouch].onTouchEnd, (event: PIXI.interaction.InteractionEvent) => {
            if (event.data.identifier != this._touchIdentifier) return;

            this._touchIdentifier = undefined;
            this.isTouched = false;
            this.resetPosition();
            this.onAxisChange(this._axes);
        });
        this.on(events[mouseOrTouch].onTouchEndOutside, (event: PIXI.interaction.InteractionEvent) => {
            if (event.data.identifier != this._touchIdentifier) return;

            this._touchIdentifier = undefined;
            this.isTouched = false;
            this.resetPosition();
            this.onAxisChange(this._axes);
        });
    }

    public resetPosition() {
        this._nub.x = 0;
        this._nub.y = 0;

        this._axes.x = 0;
        this._axes.y = 0;
    }
}