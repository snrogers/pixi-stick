export function magnitude(vec: PIXI.Point) {
    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
}

export function unitVector(vec: PIXI.Point, outVec?: PIXI.Point) {
    outVec = outVec || new PIXI.Point();

    let mag = magnitude(vec);

    outVec.x = vec.x / mag;
    outVec.y = vec.y / mag;

    return outVec;
}

export function sign(value: number) {
    return value ? (value < 0 ? -1 : 1) : null
}

export function isMouseEvent(event: MouseEvent | any): event is MouseEvent {
    return (<MouseEvent>event).button !== undefined;
}

export function isTouchEvent(event: TouchEvent | any): event is TouchEvent {
    return (<TouchEvent>event).changedTouches !== undefined;
}

// export function computeTransformFromCanvas(canvas: HTMLCanvasElement, transform: PIXI.Matrix) {
//     let canvasStyle = getComputedStyle(canvas);
//     transform.a = Number(canvasStyle.width.slice(0, -2)) / canvas.width;
//     transform.b = 0;
//     transform.c = 0;
//     transform.d = Number(canvasStyle.height.slice(0, -2)) / canvas.height;
//     transform.tx = (!Number(canvasStyle.left.slice(0, -2))) ? 0 : Number(getComputedStyle(canvas).left.slice(0, -2));
//     transform.ty = (!Number(canvasStyle.top.slice(0, -2))) ? 0 : Number(getComputedStyle(canvas).top.slice(0, -2));
// }