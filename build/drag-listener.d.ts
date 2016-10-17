/***********************/
/*** Everything Else ***/
/***********************/
export interface IListenerDictionary {
    [key: string]: (event: Touch | MouseEvent) => void;
}
export declare const dragListener: IListenerDictionary;
