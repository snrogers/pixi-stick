import ControllableStage from './controllable-stage';

export interface IController {
    emit: (eventString: string, event: any) => void;
    id: number;
    identifier: number;
    stage: ControllableStage;
}

export default IController;