import * as PIXI from 'pixi.js'

export { StickController } from './stick-controller';
export { StickArea as StickAreaController } from './stick-area';

import { transformManager } from './transformManager';

export function init(renderer: PIXI.SystemRenderer) { transformManager.renderer = renderer; }
