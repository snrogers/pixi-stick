export { magnitude, unitVector } from './util';

// export { Stick } from './stick';
import IStickOptions from './istickoptions';
import Joystick from './joystick';

export { debug } from './debug';


// TODO: HUUUUUGE TODO: take node-uuid out of the bundle

import StickController from './stick-controller';


export class Stick extends StickController {

    constructor(x: number, y: number, options: IStickOptions = {}) {
        options.type = 'static';
        super(x, y, options)
    }

}

export { StickArea } from './stick-area';

// export class StickArea extends StickController {
//     constructor(x: number, y: number, options: IStickOptions = {}) {
//         options.type = 'dynamic';
//         super(x, y, options)
//     }
// }
