import IStickOptions from './istick-options';
import * as PIXI from 'pixi.js';
/**
 * The graphical component. Contains no business logic (which is handled in StickController)
 */
export declare class Joystick extends PIXI.Container {
    private _options;
    well: PIXI.Sprite | PIXI.Graphics;
    nub: PIXI.Sprite | PIXI.Graphics;
    constructor(x: number, y: number, options: IStickOptions);
    private _initGraphics();
}
export default Joystick;
