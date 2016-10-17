import { GeneralController } from './general-controller';
import { IStickOptions } from './istick-options';
import * as PIXI from 'pixi.js';
export interface IStickAreaOptions extends IStickOptions {
    [key: string]: any;
    debug?: boolean;
}
export declare class StickAreaController extends GeneralController {
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
