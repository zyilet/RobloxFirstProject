import { PetConfig } from "shared/GameConfig/PetConfig";
import { IFsm } from "./IFsm";
import { IFsmState } from "./IFsmState";

export abstract class FsmStateBase<TOwner, TKeys> implements IFsmState<TOwner, TKeys>
{
    protected owner: TOwner
    protected fsm: IFsm<TOwner, TKeys>

    constructor(owner: TOwner, fsm: IFsm<TOwner, TKeys>)
    {
        this.owner = owner
        this.fsm = fsm
    }

    abstract GetKey(): TKeys

    abstract OnEntry(): void
    abstract OnUpdate(dt: number): void
    abstract OnExit(): void
}

export class TestOwner
{
    public Idle()
    {
        print("idle")
    }

    public Run()
    {
        print("run")
    }
}

class TestStateInfo
{

}

export type TestStateKeys = "IdleState" | "RunState"
export class IdleState extends FsmStateBase<TestOwner, TestStateKeys>
{
    private timer: number = 0
    private lastSayTimer: number = 0

    GetKey(): TestStateKeys
    {
        return "IdleState"
    }

    OnEntry(): void
    {
        this.timer = 0
        this.lastSayTimer = 0
        print("进入idle状态")
    }
    OnUpdate(dt: number): void
    {
        this.timer += dt

        if (this.timer - this.lastSayTimer >= 1)
        {
            this.lastSayTimer = this.timer
            this.owner.Idle()
        }

        if (this.timer >= 10)
        {
            this.fsm.ChangeState("RunState")
        }
    }
    OnExit(): void
    {
        print("退出idle状态")
    }
}

export class RunState extends FsmStateBase<TestOwner, TestStateKeys>
{
    private timer: number = 0
    private lastSayTimer: number = 0

    GetKey(): TestStateKeys
    {
        return "RunState"
    }
    OnEntry(): void
    {
        this.timer = 0
        this.lastSayTimer = 0
        print("进入奔跑状态")
    }
    OnUpdate(dt: number): void
    {
        this.timer += dt

        if (this.timer - this.lastSayTimer >= 1)
        {
            this.lastSayTimer = this.timer
            this.owner.Run()
        }

        if (this.timer >= 10)
        {
            this.fsm.ChangeState("IdleState")
        }
    }
    OnExit(): void
    {
        print("退出奔跑状态")
    }
}