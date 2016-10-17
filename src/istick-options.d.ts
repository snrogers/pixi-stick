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
