import { FsmStateBase } from "shared/FSM/FsmStateBase";
import { GameManager } from "../GameManager";
import { GameStateKeys } from "./StateKeys";

export class GameMainState extends FsmStateBase<GameManager, GameStateKeys>
{
    GetKey(): GameStateKeys
    {
        return "Main"
    }
    OnEntry(): void
    {
    }
    OnUpdate(dt: number): void
    {
    }
    OnExit(): void
    {
    }

}