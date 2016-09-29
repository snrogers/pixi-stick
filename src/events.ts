export interface IEventCategory {
    [key: string]: string;
    
    onTouchStart: string;
    onTouchMove: string;
    onTouchEnd: string;
    onTouchEndOutside: string;
}

export const events: { [eventType: string]: IEventCategory } = {
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