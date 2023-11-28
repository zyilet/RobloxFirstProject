import { FsmStateBase } from "shared/FSM/FsmStateBase";
import { GameManager } from "../GameManager";
import { GameStateKeys } from "./StateKeys";
import { UIManager } from "client/game/UIManager/UIManager";
import { UIMainPanel } from "client/game/UIManager/UIPanels/UIMainPanel";

export class GameMainState extends FsmStateBase<GameManager, GameStateKeys>
{
    GetKey(): GameStateKeys
    {
        return "Main"
    }
    OnEntry(): void
    {
        UIManager.GetInstance().Open(UIMainPanel)
    }
    OnUpdate(dt: number): void
    {
    }
    OnExit(): void
    {
    }

}