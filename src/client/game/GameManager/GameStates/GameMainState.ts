import { FsmStateBase } from "shared/FSM/FsmStateBase";
import { GameManager } from "../GameManager";
import { GameStateKeys } from "./StateKeys";
import { UIManager } from "client/game/UIManager/UIManager";
import { UIMainPanel } from "client/game/UIManager/UIPanels/UIMainPanel";
import { WeaponDataManager } from "client/game/DataManager/WeaponDataManager";
import { UserInputService } from "@rbxts/services";
import { ConfirmPanel, ConfirmPanelParam } from "client/game/UIManager/ConfirmPanel/ConfirmPanel";
import { MainPanel } from "client/game/UIManager/MainPanel/MainPanel";

export class GameMainState extends FsmStateBase<GameManager, GameStateKeys>
{
    GetKey(): GameStateKeys
    {
        return "Main"
    }
    OnEntry(): void
    {
        UIManager.GetInstance().Open(MainPanel)

        UserInputService.InputEnded.Connect(input =>
        {
            if (input.KeyCode === Enum.KeyCode.P)
            {
                UIManager.GetInstance().Open(ConfirmPanel, new ConfirmPanelParam(
                    "测试",
                    () =>
                    {
                        print("confirm")
                    },
                    () =>
                    {
                        print("close")
                    }
                ))
            }
        })
    }
    private timer = 0
    OnUpdate(dt: number): void
    {
        this.timer += dt
        if (this.timer >= 1)
        {
            this.timer = 0
            print(WeaponDataManager.GetInstance().GetAllWeapons().size())
        }

    }
    OnExit(): void
    {
    }

}