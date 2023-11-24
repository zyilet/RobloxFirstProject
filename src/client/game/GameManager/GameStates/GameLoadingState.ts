import { FsmStateBase } from "shared/FSM/FsmStateBase";
import { GameManager } from "../GameManager";
import { GameStateKeys } from "./StateKeys";
import { KnitClient } from "@rbxts/knit";

export class GameLoadingState extends FsmStateBase<GameManager, GameStateKeys>
{

    private initProgressValue = 0

    GetKey(): GameStateKeys
    {
        return "Loading"
    }

    OnEntry(): void
    {
        KnitClient.GetService("InitializeService").InitializeProgress.Connect(data =>
        {
            if (data.state === "initializing")
            {
                this.initProgressValue = data.progress
                return
            }

            if (data.state === "initialized")
            {
                this.initProgressValue = 1
                return
            }
        })


    }

    OnUpdate(dt: number): void
    {
        print(this.initProgressValue)
    }

    OnExit(): void
    {
        print("loading exit")
    }
}