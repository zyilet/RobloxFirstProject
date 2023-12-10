import { KnitClient } from "@rbxts/knit";
import { ControlSystem } from "./game/ControlManager";
import { InsertService, Players, RunService, StarterGui, UserInputService, Workspace } from "@rbxts/services";
import { WaitHumanoidRoot } from "shared/Constants";
import { Transform } from "shared/Transform";
import { Connection } from "@rbxts/knit/Knit/Util/Signal";
import { GameManager } from "./game/GameManager/GameManager";
import { MessageManager } from "./game/MessageManager/MessageManager";
import { UIManager } from "./game/UIManager/UIManager";
import { UILoadingPanel } from "./game/UIManager/UIPanels/UILoadingPanel";
import { DataManager } from "./game/DataManager/DataManager";
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig";
import { ScaledButton } from "./game/UIManager/UIElements/ScaledButton";
import { UITools } from "./game/UIManager/UITools";
import { Subscribable, UIEvent } from "./game/UIManager/UIEvent";
import { ScalableButton } from "./game/UIManager/Base/ScalableButton";

// Knit.AddControllers(script.Parent!.FindFirstChild("controllers") as Folder);
// Component.Auto(script.Parent!.FindFirstChild("components") as Folder);


class DebugPlayerDataPanel
{
    private frame: Frame
    private weaponBox: ScrollingFrame
    private equipWeaponBox: ScrollingFrame
    private petBox: ScrollingFrame
    private equipPetBox: ScrollingFrame
    private attack: TextLabel
    private gold: TextLabel
    private weaponCount: TextLabel
    private petCount: TextLabel
    private button: TextButton
    private textCopy: TextLabel

    constructor()
    {
        let gui = Players.LocalPlayer.FindFirstChild("PlayerGui")?.FindFirstChild("DebugPlayerDataPanel") as ScreenGui
        while (!gui && wait())
        {
            gui = Players.LocalPlayer.FindFirstChild("PlayerGui")?.FindFirstChild("DebugPlayerDataPanel") as ScreenGui
        }

        this.frame = UITools.FindEle(gui, "Frame")
        this.weaponBox = UITools.FindEle(gui, "weaponBox")
        this.equipWeaponBox = UITools.FindEle(gui, "equipWeaponBox")
        this.petBox = UITools.FindEle(gui, "petBox")
        this.equipPetBox = UITools.FindEle(gui, "equipPetBox")
        this.attack = UITools.FindEle(gui, "attack")
        this.gold = UITools.FindEle(gui, "gold")
        this.weaponCount = UITools.FindEle(gui, "weaponCount")
        this.petCount = UITools.FindEle(gui, "petCount")
        this.button = UITools.FindEle(gui, "button")
        this.textCopy = UITools.FindEle(gui, "textCopy")

        this.frame.Visible = false

        this.button.MouseButton1Click.Connect(() => this.frame.Visible = !this.frame.Visible)

        this.Init()
    }

    private Init()
    {
        KnitClient.GetService("DebugPlayerDataService").PlayerData.Connect(data =>
        {
            this.attack.Text = `attack: ${data.Attack}`
            this.gold.Text = `gold: ${data.Gold}`
            this.weaponCount.Text = `weaponCount: ${data.Weapons.size()}`
            this.petCount.Text = `petCount: ${data.Pets.size()}`
            this.weaponBox.ClearAllChildren()
            new Instance("UIListLayout").Parent = this.weaponBox
            this.equipWeaponBox.ClearAllChildren()
            new Instance("UIListLayout").Parent = this.equipWeaponBox
            this.petBox.ClearAllChildren()
            new Instance("UIListLayout").Parent = this.petBox
            this.equipPetBox.ClearAllChildren()
            new Instance("UIListLayout").Parent = this.equipPetBox

            data.Weapons.forEach((weapon, index) =>
            {
                let textTop = this.textCopy.Clone()
                textTop.Visible = true
                textTop.Text = `No.${index + 1} 武器ID:${weapon.Id}`
                textTop.Parent = this.weaponBox
                let textBottom = this.textCopy.Clone()
                textBottom.Visible = true
                textBottom.Text = `Guid:${weapon.Guid}`
                textBottom.Parent = this.weaponBox

                data.EquippedWeapon.forEach((guid) =>
                {
                    if (guid === weapon.Guid)
                    {
                        let textTop = this.textCopy.Clone()
                        textTop.Visible = true
                        textTop.Text = `No.${index + 1} 武器ID:${weapon.Id}`
                        textTop.Parent = this.equipWeaponBox
                        let textBottom = this.textCopy.Clone()
                        textBottom.Visible = true
                        textBottom.Text = `Guid:${weapon.Guid}`
                        textBottom.Parent = this.equipWeaponBox
                    }
                })
            })

            data.Pets.forEach((pet, index) =>
            {
                let textTop = this.textCopy.Clone()
                textTop.Visible = true
                textTop.Text = `No.${index + 1} 宠物ID:${pet.Id}`
                textTop.Parent = this.petBox
                let textBottom = this.textCopy.Clone()
                textBottom.Visible = true
                textBottom.Text = `Guid:${pet.Guid}`
                textBottom.Parent = this.petBox

                data.EquippedPets.forEach((guid) =>
                {
                    if (guid === pet.Guid)
                    {
                        let textTop = this.textCopy.Clone()
                        textTop.Visible = true
                        textTop.Text = `No.${index + 1} 宠物ID:${pet.Id}`
                        textTop.Parent = this.equipPetBox
                        let textBottom = this.textCopy.Clone()
                        textBottom.Visible = true
                        textBottom.Text = `Guid:${pet.Guid}`
                        textBottom.Parent = this.equipPetBox
                    }
                })
            })
        })
    }
}

KnitClient.Start()
    .andThen(() =>
    {
        print("Client Started");

        //游戏逻辑入口，帧循环驱动
        let gameManager = GameManager.GetInstance().Init()

        RunService.Heartbeat.Connect(dt =>
        {
            gameManager.Update(dt)
        })

        new DebugPlayerDataPanel()
    })
    .catch(warn)

// task.wait(5)

// print("加载角色")
// KnitClient.GetService("GameService").LoadCharacter.Fire()

// task.wait(3)

// let cb = new Instance("BindableEvent")
// cb.Event.Connect(() =>
// {
//     print("重置角色")
//     KnitClient.GetService("GameService").ResetCharacter.Fire()
// })

// StarterGui.SetCore("ResetButtonCallback", true)
// StarterGui.SetCore("ResetButtonCallback", cb)

// KnitClient.GetService("GameService").GetInitializeProgress()

// let c = Players.LocalPlayer.GetMouse().Button1Down.Connect(() =>
// {
//     if (!UIManager.GetInstance().IsOpening(UILoadingPanel))
//     {
//         UIManager.GetInstance().Open(UILoadingPanel)
//     }
//     c.Disconnect()
// })