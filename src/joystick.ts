import { magnitude, sign, unitVector } from './util';
import IStickOptions from './istickoptions';

import debug from './debug';

/**
 * The graphical component. Contains no business logic (which is handled in StickController)
 */
export class Joystick extends PIXI.Container {

    public id: string = debug.id(this, 'Stick');

    private _options: IStickOptions = {
        opacity: 0.25
    };

    public well: PIXI.Container;
    public nub: PIXI.Container;

    constructor(x: number, y: number, options: IStickOptions) {
        super();

        this.x = x;
        this.y = y;

        for (let prop in options) {
            if (options.hasOwnProperty(prop)) {
                this._options[prop] = options[prop];
            }
        }

        this._initGraphics();
    }

    private _initGraphics() {

        // Init Well
        if (this._options.well) {
            this.well = this._options.well;
            this.well.alpha = this._options.opacity;
            this.well.width = this._options.wellRadius * 2;
            this.well.height = this._options.wellRadius * 2;

            // TODO: Anchor only works on Sprite, not Container. Should add a wellAnchor property to deal with this
            this.well.anchor.x = 0.5;
            this.well.anchor.y = 0.5;

        } else {
            this.well = new PIXI.Graphics();
            switch (this._options.axes) {
                case 'xy':
                    (<PIXI.Graphics>this.well).beginFill(0xffffff, this._options.opacity);
                    (<PIXI.Graphics>this.well).drawCircle(0, 0, this._options.wellRadius);
                    (<PIXI.Graphics>this.well).endFill();
                    break;
                case 'x':
                    (<PIXI.Graphics>this.well).beginFill(0xffffff, this._options.opacity);
                    (<PIXI.Graphics>this.well).drawRoundedRect(
                        -this._options.wellRadius - this._options.wellRadius * this._options.nubSize,
                        -(this._options.wellRadius * this._options.nubSize),
                        this._options.wellRadius * 2 + this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * this._options.nubSize
                    );
                    (<PIXI.Graphics>this.well).endFill();
                    break;
                case 'y':
                    (<PIXI.Graphics>this.well).beginFill(0xffffff, this._options.opacity);
                    (<PIXI.Graphics>this.well).drawRoundedRect(
                        -(this._options.wellRadius * this._options.nubSize),
                        -this._options.wellRadius - this._options.wellRadius * this._options.nubSize,
                        this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * 2 + this._options.wellRadius * 2 * this._options.nubSize,
                        this._options.wellRadius * this._options.nubSize
                    );
                    (<PIXI.Graphics>this.well).endFill();
                    break;
                default:
                    console.warn(this._options);
                    throw new Error(this._options.axes + ' is not a valid stick axes');
            }
        }


        // Init Nub
        if (this._options.nub) {
            this.nub = this._options.nub;
            this.nub.alpha = this._options.opacity;
            this.nub.width = this._options.wellRadius * this._options.nubSize * 2;
            this.nub.height = this._options.wellRadius * this._options.nubSize * 2;

            // TODO: Anchor only works on Sprite, not Container. Should add a nubAnchor property to deal with this
            this.nub.anchor.x = 0.5;
            this.nub.anchor.y = 0.5;
        } else {
            this.nub = new PIXI.Graphics();
            (<PIXI.Graphics>this.nub).beginFill(0xffffff, this._options.opacity);
            (<PIXI.Graphics>this.nub).drawCircle(0, 0, this._options.wellRadius * this._options.nubSize);
            (<PIXI.Graphics>this.nub).endFill();
        }

        // Add children
        this.addChild(this.well);
        this.addChild(this.nub);
    }
}

export default Joystick;