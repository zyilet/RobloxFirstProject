import { FsmStateBase } from "shared/FSM/FsmStateBase";
import { GameManager } from "../GameManager";
import { GameStateKeys } from "./StateKeys";
import { UIManager } from "client/game/UIManager/UIManager";

export class GameMainState extends FsmStateBase<GameManager, GameStateKeys>
{
    GetKey(): GameStateKeys {
        return "Main"
    }
    OnEntry(): void {

    }
    OnUpdate(dt: number): void {
    }
    OnExit(): void {
    }

}