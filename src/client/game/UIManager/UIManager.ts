import { Players } from "@rbxts/services";
import { DataManager } from "../DataManager/DataManager";
import { PlayerWeaponData, WeaponDataManager } from "../DataManager/WeaponDataManager";
import { Messages } from "../MessageManager/MessageDefine";
import { MessageManager } from "../MessageManager/MessageManager";
import { ObtainWeaponPanel } from "./ObtainWeaponPanel/ObtainWeaponPanel";
import { TipsPanel } from "./TipsPanel/TipsPanel";
import { UIPanel } from "./UIPanel";
import { UIPanelStack } from "./UIPanelStack";

export class UIManager
{

    private static instance: UIManager
    public static GetInstance()
    {
        return this.instance ??= new UIManager()
    }


    private uiPanelStack: UIPanelStack = new UIPanelStack()
    private obtainWeaponPanel: ObtainWeaponPanel | undefined
    private tipsPanel: TipsPanel | undefined

    public Init()
    {
        MessageManager.GetInstance().Subscribe(Messages.AddWeapon, data =>
        {
            let weapon = data as PlayerWeaponData
            this.ShowNewWeapon(weapon)
        })

        MessageManager.GetInstance().Subscribe(Messages.WeaponLimit, () =>
        {
            this.ShowTips("The weapon inventory is full!, please sell some weapons.")
        })
        return this
    }

    public Update(dt: number)
    {
        if (this.uiPanelStack.GetDepth() > 0)
        {
            let [name, panel] = this.uiPanelStack.Peek()
            panel.Update(dt)
        }

        if (this.obtainWeaponPanel)
        {
            this.obtainWeaponPanel.Update(dt)
            if (this.obtainWeaponPanel.ShowTime >= 3)
            {
                this.obtainWeaponPanel.Hide()
                this.obtainWeaponPanel = undefined
            }
        }

        if (this.tipsPanel)
        {
            if (this.tipsPanel.GetCurTipsCount() <= 0)
            {
                this.tipsPanel.Destroy()
                this.tipsPanel = undefined
            }
        }
    }

    public Open<T extends UIPanel>(UIPanel: { new(): T, Name: string }, ...params: unknown[])
    {
        if (this.uiPanelStack.GetDepth() > 0)
        {
            let [name, panel] = this.uiPanelStack.Peek()
            panel.Covered()
        }

        let panel = new UIPanel()
        this.uiPanelStack.Push([UIPanel.Name, panel])
        panel.Show(this.uiPanelStack.GetDepth(), ...params)

        return panel
    }

    public Close<T extends UIPanel>(UIPanel: { new(): T, Name: string })
    {
        if (!this.uiPanelStack.Exist(UIPanel.Name))
        {
            error("当前不存在这个UI页面")
        }

        while (this.uiPanelStack.GetDepth() > 0)
        {
            let [name, panel] = this.uiPanelStack.Pop()
            let data = panel.Close()

            if (this.uiPanelStack.GetDepth() > 0)
            {
                let [nextName, nextPanel] = this.uiPanelStack.Peek()
                nextPanel.UnCovered()
            }

            if (name === UIPanel.Name)
            {
                return
            }
        }
    }

    public ShowNewWeapon(weaponData: PlayerWeaponData)
    {
        if (this.obtainWeaponPanel)
        {
            this.obtainWeaponPanel.Destroy()
        }
        this.obtainWeaponPanel = new ObtainWeaponPanel(weaponData)
        this.obtainWeaponPanel.Show()

        this.obtainWeaponPanel.SetDepth((Players.LocalPlayer.FindFirstChild("PlayerGui")?.GetDescendants().size() ?? 0) + 1)
    }

    public ShowTips(info: string, color: Color3 | undefined = undefined)
    {
        if (!color)
        {
            color = Color3.fromHex("aa0000")
        }

        this.tipsPanel ??= new TipsPanel()
        this.tipsPanel.ShowTip(info, color)

        this.tipsPanel.SetDepth((Players.LocalPlayer.FindFirstChild("PlayerGui")?.GetDescendants().size() ?? 0) + 1)
    }

    public IsOpening<T extends UIPanel>(UIPanel: { new(): T, Name: string })
    {
        return this.uiPanelStack.Exist(UIPanel.Name)
    }
}
