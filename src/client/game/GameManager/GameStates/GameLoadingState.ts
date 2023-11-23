import { FsmStateBase } from "shared/FSM/FsmStateBase";
import { GameManager } from "../GameManager";
import { GameStateKeys } from "./StateKeys";

export class GameLoadingState extends FsmStateBase<GameManager, GameStateKeys>
{
    GetKey(): GameStateKeys
    {
        return "Loading"
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