import { Fsm } from "shared/FSM/Fsm"
import { GameStateKeys } from "./GameStates/StateKeys"
import { GameLoadingState } from "./GameStates/GameLoadingState"
import { GameMainState } from "./GameStates/GameMainState"

export class GameManager
{
    private static instance: GameManager
    public static GetInstance()
    {
        return this.instance ??= new GameManager()
    }

    private fsm?: Fsm<GameManager, GameStateKeys>

    public Init()
    {
        this.fsm = new Fsm()
        this.fsm.AddState(new GameLoadingState(this, this.fsm))
        this.fsm.AddState(new GameMainState(this, this.fsm))
        this.fsm.Start("Loading")
        return this
    }

    public Update(dt: number)
    {
        this.fsm?.Update(dt)
    }
}