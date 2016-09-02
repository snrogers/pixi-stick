import { Stick } from './stick';

// TODO: Move this into the PIXI d.ts
interface IPixiMouseEvent {
    data: PIXI.interaction.InteractionData;
    stopPropagation: Function;
    stopped: boolean;
    target: PIXI.DisplayObject;
    type: string;
}

export interface IStickAreaOptions {
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


export class StickArea extends PIXI.Graphics {

    private _options: IStickAreaOptions = {
        debug: false
    }

    private _stick: Stick;
    private _axes: PIXI.Point;

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

        this.x = 0;
        this.y = 0;
        this.interactive = true;


        this.beginFill(generateColor(), this._options.debug ? 0.7 : 0);
        this.drawShape(new PIXI.Rectangle(x, y, width, height));
        this.endFill();

        this._initMouseEvents();
        this._initTouchEvents();

        this._stick = new Stick(0, 0);
    }

    private _initGraphics() {
    }

    private _initMouseEvents() {
        this.on('mousedown', (event: IPixiMouseEvent) => {
            console.log('StickArea.mousedown');
            this.isTouched = true;
            this._spawnStick(event.data.getLocalPosition(this, this._axes));
        });


        this.on('mouseup', (event: IPixiMouseEvent) => {
            this.isTouched = false;
            this._stick.resetPosition();
            this._despawnStick();
        });
        this.on('mouseupoutside', (event: IPixiMouseEvent) => {
            this.isTouched = false;
            this._stick.resetPosition();
            this._despawnStick();
        });
    }

    private _initTouchEvents() {
        this.on('touchstart', (event: IPixiMouseEvent) => {
            this.isTouched = true;
            this._spawnStick(event.data.getLocalPosition(this, this._axes));
        });

        this.on('touchend', (event: IPixiMouseEvent) => {
            this.isTouched = false;
            this._stick.resetPosition();
            this._despawnStick();
        });
        this.on('touchendoutside', (event: IPixiMouseEvent) => {
            this.isTouched = false;
            this._stick.resetPosition();
            this._despawnStick();
        });
    }

    get isTouched() { return this._stick.isTouched; }
    set isTouched(value: boolean) { this._stick.isTouched = value; }

    private _despawnStick() {
        this.removeChild(this._stick);
    }

    private _spawnStick(position: PIXI.Point) {
        console.log('spawning stick at [' + position.x + ',' + position.y + ']');
        this.addChild(this._stick);
        this._stick.x = position.x;
        this._stick.y = position.y;
        this._stick.isTouched = true;
    }
}
