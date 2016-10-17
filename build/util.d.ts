import * as PIXI from 'pixi.js';
export declare function magnitude(vec: PIXI.Point): number;
export declare function unitVector(vec: PIXI.Point, outVec?: PIXI.Point): PIXI.Point;
export declare function sign(value: number): number;
export declare function isMouseEvent(event: MouseEvent | any): event is MouseEvent;
export declare function isTouchEvent(event: TouchEvent | any): event is TouchEvent;
