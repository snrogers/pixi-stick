import IController from './icontroller';
import { IEventCategory, events } from './events';

export class ControllableStage extends PIXI.Container {
    private _controllerIndex: number;
    private _controllers: IController[];

    constructor() {
        super();

        this._controllerIndex = 0;
        this._controllers = [];

        this.interactive = true;

        this._initEvents('mouse');
        this._initEvents('touch');
    }

    // Initializes event forwarding
    private _initEvents(eventType: string) {
        for (let eventName in events[eventType]) {
            this.on(events[eventType][eventName], (event: PIXI.interaction.InteractionEvent) => {
                if (events[eventType][eventName] !== 'touchmove') {
                    console.warn('**** Stage hit by Event: [' + events[eventType][eventName] + '] ****');
                    console.log(event);
                    console.warn('*****************************************');
                }

                for (let i = 0; i < this._controllers.length; i++) {
                    if (this._controllers[i].identifier === event.data.identifier) {
                        this._controllers[i].emit(events[eventType][eventName], event);
                        break;
                    }
                }
            });
        }
    }

    public addController(controller: IController) {
        controller.id = this._controllerIndex++;
        controller.stage = this;
        this._controllers.push(controller);
        this.addChild(controller);
    }

    // This will ensure that any touch events that miss everything else STILL get caught by the ControllableStage
    public containsPoint(point: PIXI.Point){
        return true;
    }

}

export default ControllableStage;