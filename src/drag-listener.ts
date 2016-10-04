import { magnitude, sign, unitVector} from './util';



/************************/
/*** The Monkey Patch ***/
/************************/
/* We monkey patch autoDetectRenderer() so that
 * we keep a reference to the mapPositionToPoint method
 * of the most recently created SystemRenderer
*/

let mapPositionToPoint: (point: PIXI.Point, x: number, y: number) => PIXI.Point;

PIXI.autoDetectRenderer = (function (func: (width: number, height: number, options?: PIXI.RendererOptions, noWebGL?: boolean) => PIXI.WebGLRenderer | PIXI.CanvasRenderer) {
    return function (width: number, height: number, options?: PIXI.RendererOptions, noWebGL?: boolean) {
        let renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer = window.capturedRenderer = func(width, height, options, noWebGL);
        mapPositionToPoint = renderer.plugins.interaction.mapPositionToPoint.bind(renderer.plugins.interaction);
        return renderer;
    }
})(PIXI.autoDetectRenderer);



/***********************/
/*** Everything Else ***/
/***********************/

export interface IListenerDictionary {
    [key: string]: (event: Touch | MouseEvent) => void,
}

export const dragListener: IListenerDictionary = {

    xy: function (event: Touch | MouseEvent) {
        mapPositionToPoint(this._axes, event.clientX, event.clientY)
        this._joystick.toLocal(this._axes, null, this._axes);

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

        if (this.onTouchMove) this.onTouchMove(this._axes);
        if (this.onAxisChange) this.onAxisChange(this._axes);
    },

    x: function (event: Touch | MouseEvent) {
        mapPositionToPoint(this._axes, event.clientX, event.clientY)
        this._joystick.toLocal(this._axes, null, this._axes);

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

        if (this.onTouchMove) this.onTouchMove(this._axes);
        if (this.onAxisChange) this.onAxisChange(this._axes);
    },

    y: function dragListenerY(event: Touch | MouseEvent) {
        mapPositionToPoint(this._axes, event.clientX, event.clientY)
        this._joystick.toLocal(this._axes, null, this._axes);

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

        if (this.onTouchMove) this.onTouchMove(this._axes);
        if (this.onAxisChange) this.onAxisChange(this._axes);
    }
}