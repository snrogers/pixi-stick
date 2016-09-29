import * as PIXI from 'pixi.js'

export { StickController } from './stick-controller';
export { StickAreaController } from './stick-area-controller';

import { transformManager } from './transform-manager';

export function init(renderer: PIXI.SystemRenderer) { transformManager.renderer = renderer; }
