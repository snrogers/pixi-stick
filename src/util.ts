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

// function sgn(x) {
//   return (x > 0) - (x < 0);
// }
