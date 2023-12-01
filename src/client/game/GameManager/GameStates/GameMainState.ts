import { FsmStateBase } from "shared/FSM/FsmStateBase";
import { GameManager } from "../GameManager";
import { GameStateKeys } from "./StateKeys";
import { UIManager } from "client/game/UIManager/UIManager";
import { UIMainPanel } from "client/game/UIManager/UIPanels/UIMainPanel";
import { WeaponDataManager } from "client/game/DataManager/WeaponDataManager";

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