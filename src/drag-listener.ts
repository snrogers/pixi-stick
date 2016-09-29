import { magnitude, sign, unitVector} from './util';
import { transformManager } from './transform-manager';

export interface IListenerDictionary {
    [key: string]: (event: Touch | MouseEvent) => void,
}

export const dragListener: IListenerDictionary = {

    xy: function (event: Touch | MouseEvent) {
        transformManager.mapPositionToPoint(this._axes, event.clientX, event.clientY)
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
        transformManager.mapPositionToPoint(this._axes, event.clientX, event.clientY)
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
        transformManager.mapPositionToPoint(this._axes, event.clientX, event.clientY)
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