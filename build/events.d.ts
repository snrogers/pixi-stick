export interface IEventCategory {
    [key: string]: string;
    onTouchStart: string;
    onTouchMove: string;
    onTouchEnd: string;
    onTouchEndOutside: string;
}
export declare const events: {
    [eventType: string]: IEventCategory;
};
