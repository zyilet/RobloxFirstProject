import { Players } from "@rbxts/services";
import { BasePanel } from "./Panels/BasePanel";
import { MainPanel } from "./Panels/MainPanel";
import { UIUtils } from "../UIUtils";

export type UIPanelName = "MainPanel" | "TestPanel"

export class UIManager
{
    private static _instance: UIManager;
    public static GetInstance()
    {
        return this._instance ??= new UIManager();
    }

    private _nameToPanels = new Map<UIPanelName, BasePanel>();

    public Show(name: UIPanelName)
    {
        if (!this._nameToPanels.has(name))
        {
            let panel = this.GetPanelForName(name);
            if (!panel)
            {
                warn(`${name} 没有相对应的panel实例`)
                return;
            }
            panel.Init(UIUtils.GetUIPanel(name));
            this._nameToPanels.set(name, panel);
        }

        let panel = this._nameToPanels.get(name)!;
        panel.Show();
    }

    public Hide(name: UIPanelName)
    {
        let panel = this._nameToPanels.get(name);
        if (!panel)
        {
            warn(`${name} 没有可以关闭的实例`)
            return;
        }

        panel.Hide();
    }

    private GetPanelForName(name: UIPanelName)
    {
        switch (name)
        {
            case "MainPanel":
                return new MainPanel();
        }
        return undefined;
    }
}