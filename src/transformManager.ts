
/**
 * Provides a way to get at the InteractionManager.mapPositionToPoint() function from outside of the InteractionManager
 */
export const transformManager = {
    _renderer: PIXI.SystemRenderer,
    get renderer() { return this._renderer },
    set renderer(value: PIXI.SystemRenderer) { this._renderer = value; },
    mapPositionToPoint: function (point: PIXI.Point, x: number, y: number) {
        return this._renderer.plugins.interaction.mapPositionToPoint(point, x, y);
    }
}

