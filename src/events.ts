export interface IEventNames {
    onTouchStart: string;
    onTouchMove: string;
    onTouchEnd: string;
    onTouchEndOutside: string;
}

export const events: { [eventType: string]: IEventNames } = {
    mouse: {
        onTouchStart: 'mousedown',
        onTouchMove: 'mousemove',
        onTouchEnd: 'mouseup',
        onTouchEndOutside: 'mouseupoutside'
    },
    touch: {
        onTouchStart: 'touchstart',
        onTouchMove: 'touchmove',
        onTouchEnd: 'touchend',
        onTouchEndOutside: 'touchendoutside'
    }
}

export default events;