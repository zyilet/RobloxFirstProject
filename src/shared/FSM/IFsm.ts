import { IFsmState } from "./IFsmState";

export interface IFsm<TOwner, TKeys>
{
    GetCurState(): IFsmState<TOwner, TKeys>
    AddState(state: IFsmState<TOwner, TKeys>): void
    Update(dt: number): void

    Start(key: TKeys): void
    ChangeState(key: TKeys): void

    SetData(key: string, data: any): void
    GetData(key: string): any
    RemoveData(key: string): any
}