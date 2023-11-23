import { UserInputService } from "@rbxts/services";
import { IFsm } from "./IFsm";
import { IFsmState } from "./IFsmState";

export class Fsm<TOwner, TKeys> implements IFsm<TOwner, TKeys>
{
    private states: [key: TKeys, state: IFsmState<TOwner, TKeys>][] = []
    private data: [key: string, data: any][] = []
    private curState?: IFsmState<TOwner, TKeys> = undefined
    private preStateKey?: TKeys = undefined
    private curStateKey?: TKeys = undefined
    private started: boolean = false

    GetCurState(): IFsmState<TOwner, TKeys>
    {
        for (const [key, state] of this.states)
        {
            if (key === this.curStateKey)
            {
                return state
            }
        }

        if (this.curStateKey === undefined)
        {
            error("状态机不在运行状态")
        }
        error("找不到当前正在运行的状态")
    }
    AddState(state: IFsmState<TOwner, TKeys>): void
    {
        this.states.push([state.GetKey(), state])
    }

    ChangeState(key: TKeys): void
    {
        this.curStateKey = key
    }

    Update(dt: number): void
    {
        if (this.started === false) return
        if (this.curStateKey === undefined) return

        //进入新状态
        if (this.preStateKey !== this.curStateKey)
        {
            this.curState?.OnExit()

            let result = this.states.find(([key, state]) => key === this.curStateKey)
            if (result === undefined) error(`Fsm.Update: invalid key`)
            let [key, state] = result

            this.curState = state
            this.curState.OnEntry()

            this.preStateKey = key
        }

        this.curState?.OnUpdate(dt)
    }
    Start(key: TKeys): void
    {
        this.curStateKey = key
        this.started = true
    }

    SetData(key: string, data: any): void
    {
        this.data.push([key, data])
    }
    GetData(key: string)
    {
        let result = this.data.find(([k, data]) => k === key)
        if (result === undefined) error("Fsm.GetData: invalid key")
        let [k, data] = result

        return data
    }
    RemoveData<T>(key: string)
    {
        for (let i = this.data.size() - 1; i >= 0; i--)
        {
            let [k, data] = this.data[i]
            if (k === key)
            {
                this.data.remove(i)
                return data as T
            }
        }
        error("Fsm.RemoveData: invalid key")
    }
}