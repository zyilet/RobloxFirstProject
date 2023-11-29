import { Fsm } from "shared/FSM/Fsm"
import { GameStateKeys } from "./GameStates/StateKeys"
import { GameLoadingState } from "./GameStates/GameLoadingState"
import { GameMainState } from "./GameStates/GameMainState"
import { DataManager } from "../DataManager/DataManager"
import { UIManager } from "../UIManager/UIManager"

export class GameManager
{
    private static instance: GameManager
    public static GetInstance()
    {
        return this.instance ??= new GameManager()
    }

    private dataManager?: DataManager
    private uiManager?: UIManager

    private fsm?: Fsm<GameManager, GameStateKeys>

    public Init()
    {
        this.dataManager = DataManager.GetInstance().Init()
        this.uiManager = UIManager.GetInstance().Init()
        this.fsm = this.CreateGameStateFsm()
        return this
    }

    public Update(dt: number)
    {
        this.dataManager?.Update(dt)
        this.uiManager?.Update(dt)
        this.fsm?.Update(dt)
    }

    private CreateGameStateFsm()
    {
        let fsm = new Fsm<GameManager, GameStateKeys>()
        fsm.AddState(new GameLoadingState(this, fsm))
        fsm.AddState(new GameMainState(this, fsm))
        fsm.Start("Loading")

        return fsm
    }
}