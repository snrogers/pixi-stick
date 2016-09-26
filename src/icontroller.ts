export interface IController {
    emit: (eventString: string, event: any) => void;
    id: number;
    identifier: number;
}

export default IController;