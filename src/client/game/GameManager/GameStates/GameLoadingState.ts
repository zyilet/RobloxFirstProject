import { FsmStateBase } from "shared/FSM/FsmStateBase";
import { GameManager } from "../GameManager";
import { GameStateKeys } from "./StateKeys";
import { KnitClient } from "@rbxts/knit";
import { UIManager } from "client/game/UIManager/UIManager";
import { UILoadingPanel } from "client/game/UIManager/UIPanels/UILoadingPanel";
import { Players } from "@rbxts/services";

export class GameLoadingState extends FsmStateBase<GameManager, GameStateKeys>
{

    private initProgressValue = 0

    private timer: number = 0
    private timerLimit = 5

    GetKey(): GameStateKeys
    {
        return "Loading"
    }

    OnEntry(): void
    {
        UIManager.GetInstance().Open(UILoadingPanel)

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
                KnitClient.GetService("GameService").LoadCharacter.Fire()
                return
            }
        })
    }

    OnUpdate(dt: number): void
    {
        this.timer += dt

        if (Players.LocalPlayer.Character)
        // if(this.initProgressValue === 1)
        {
            UIManager.GetInstance().Close(UILoadingPanel)
            this.fsm.ChangeState("Main")
        }
    }

    OnExit(): void
    {

    }

    private LoadCharacter()
    {

    }
}