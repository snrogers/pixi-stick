export interface IStickOptions {
    [key: string]: any;

    touch?: boolean;
    mouse?: boolean;

    axes?: 'x' | 'y' | 'xy';
    type?: 'static' | 'semi' | 'dynamic';

    deadZone?: number; // TODO: Implement deadZone
    opacity?: number;

    nub?: PIXI.Container;
    nubSize?: number;

    well?: PIXI.Container;
    wellRadius?: number;
}

export default IStickOptions;