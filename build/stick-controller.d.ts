import { IStickOptions } from './istick-options';
import { GeneralController } from './general-controller';
/****************************/
/*** The Stick Controller ***/
/****************************/
export declare class StickController extends GeneralController {
    /*******************/
    /*** Constructor ***/
    /*******************/
    constructor(x: number, y: number, options?: IStickOptions);
    protected _init(): void;
    /**
     * TouchStart is fired by the PIXI InteractionManager, but because InteractionManager.processInteractive
     * does not keep a record of the recipient of TouchStart for a given touch, the StickController has its own
     * listener on the window to ensure it is able to catch the TouchEnd event from the window (InteractionManager
     * sends the TouchEnd event to whichever object the TouchEnd occurs upon instead of the original recipient of
     * TouchStare so the StickController will not receive the TouchEnd event from the PIXI event system if the
     * user's finger is not over the StickController when they release)
     **/
    protected _initEvents(mouseOrTouch: string): void;
}
