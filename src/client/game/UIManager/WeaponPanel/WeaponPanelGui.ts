import { Players, TweenService, Workspace } from "@rbxts/services"
import { ScalableButton } from "../Base/ScalableButton"
import { Subscribable, SubscribableWithParam, UIParamEvent } from "../UIEvent"
import { UITools } from "../UITools"
import { WeaponItemButton } from "./WeaponItemButton"
import { DataManager } from "client/game/DataManager/DataManager"
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig"

type WeaponItemClickParam = {
    Guid: string,
    Button: WeaponItemButton,
    Buttons: WeaponItemButton[]
}

export type WeaponPanelState = "normal" | "multi sell"

export class WeaponPanelGui
{
    private gui: ScreenGui
    private outerUIScale: UIScale
    private innerUIScale: UIScale
    private boxWeapon: ScrollingFrame
    private textWeaponNumberLimit: TextLabel
    private textCurWeaponNumber: TextLabel
    private textBlueButton: TextLabel
    private textOrangeButton: TextLabel
    private textRedButton: TextLabel

    private btnClose: ScalableButton
    private btnEquipBest: ScalableButton
    private btnUnequipAll: ScalableButton
    private btnMultiSell: ScalableButton
    private buttons: ScalableButton[] = []
    private weaponItemClickEvent: UIParamEvent<WeaponItemClickParam> = new UIParamEvent()
    private weaponItems: Map<string, WeaponItemButton> = new Map()

    public OnEquipBestClick: Subscribable
    public OnUnequipAllClick: Subscribable
    public OnMultiSellClick: Subscribable
    public OnCloseClick: Subscribable
    public OnWeaponItemClick: SubscribableWithParam<WeaponItemClickParam>

    private uiState: WeaponPanelState = "normal"

    constructor(weaponGuidList: string[] = [])
    {
        this.gui = UITools.LoadGui("WeaponPanel")
        this.outerUIScale = UITools.FindEle(this.gui, "OuterUIScale")
        this.innerUIScale = UITools.FindEle(this.gui, "InnerUIScale")
        this.textWeaponNumberLimit = UITools.FindEle(this.gui, "TextLimit")
        this.textCurWeaponNumber = UITools.FindEle(this.gui, "TextCur")
        this.boxWeapon = UITools.FindEle(this.gui, "ScrollingFrame")
        this.textBlueButton = UITools.FindEle(this.gui, "TextBlueButton")
        this.textOrangeButton = UITools.FindEle(this.gui, "TextOrangeButton")
        this.textRedButton = UITools.FindEle(this.gui, "TextRedButton")

        this.btnClose = new ScalableButton(UITools.FindEle(this.gui, "BtnClose"))
        this.btnEquipBest = new ScalableButton(UITools.FindEle(this.gui, "BtnEquipBest"))
        this.btnUnequipAll = new ScalableButton(UITools.FindEle(this.gui, "BtnUnequipAll"))
        this.btnMultiSell = new ScalableButton(UITools.FindEle(this.gui, "BtnMultiSell"))
        this.buttons.push(this.btnClose)
        this.buttons.push(this.btnEquipBest)
        this.buttons.push(this.btnUnequipAll)
        this.buttons.push(this.btnMultiSell)

        this.OnEquipBestClick = this.btnEquipBest.OnClick
        this.OnUnequipAllClick = this.btnUnequipAll.OnClick
        this.OnMultiSellClick = this.btnMultiSell.OnClick
        this.OnCloseClick = this.btnClose.OnClick
        this.OnWeaponItemClick = this.weaponItemClickEvent.CreateSubscribable()

        //设备适配
        this.outerUIScale.Scale = Workspace.CurrentCamera!.ViewportSize.Y / 1080

        weaponGuidList.forEach(guid => this.AddWeaponItem(guid))
        this.EquipWeapon(DataManager.GetInstance().GetEquippedWeapon())
    }

    //向列表中添加武器
    public AddWeaponItem(guid: string)
    {
        if (this.weaponItems.has(guid)) error(`列表中已经存在guid为【${guid}】的武器`)

        let weaponButton = new WeaponItemButton(UITools.LoadEle<Frame>("BtnWeaponItem"))
        weaponButton.Root.Parent = this.boxWeapon
        weaponButton.LoadWeapon(guid)

        let weaponButtons: WeaponItemButton[] = []
        this.weaponItems.forEach(button => weaponButtons.push(button))
        let eventParam = {
            Guid: guid,
            Button: weaponButton,
            Buttons: weaponButtons,
        }
        weaponButton.OnClick.SubScribe(() => this.weaponItemClickEvent.Publish(eventParam))

        this.buttons.push(weaponButton)
        this.weaponItems.set(guid, weaponButton)

        this.ReOrderWeaponItems()
    }

    //从列表中删除武器
    public RemoveWeaponItem(guid: string)
    {
        if (!this.weaponItems.has(guid)) error(`列表中不存在guid为【${guid}】的武器`)

        this.weaponItems.get(guid)?.Destroy()
        this.weaponItems.delete(guid)
    }

    //装备武器
    public EquipWeapon(guids: string[])
    {
        this.weaponItems.forEach(button => button.SetEquipState(false))

        guids.forEach(guid =>
        {
            if (!this.weaponItems.has(guid)) error(`列表中不存在guid为【${guid}】的武器`)

            this.weaponItems.get(guid)?.SetEquipState(true)
            this.ReOrderWeaponItems()
        })
    }

    //选择武器
    public SelectedWeapon(guid: string)
    {
        if (!this.weaponItems.has(guid)) error(`列表中不存在guid为【${guid}】的武器`)

        //如果是普通模式，就先取消其他武器的选择状态
        if (this.uiState === "normal")
        {
            this.weaponItems.forEach((button, buttonGuid) =>
            {
                if (buttonGuid === guid)
                    return
                button.SetSelected(false)
            })
        }
        let button = this.weaponItems.get(guid)!
        button.SetSelected(!button.Selected)
    }

    public SelectAllWeapon()
    {
        this.weaponItems.forEach(button => button.SetSelected(true))

        let result: string[] = []
        this.weaponItems.forEach((_, guid) => result.push(guid))
        return result
    }

    //设置武器数量上限
    public SetLimit(number: number)
    {
        this.textWeaponNumberLimit.Text = tostring(number)
    }

    //设置当前武器数量
    public SetCurWeaponNumber(number: number)
    {
        this.textCurWeaponNumber.Text = tostring(number)
    }

    //设置页面显示状态（普通模式或者多选出售模式）
    public SetPanelState(state: WeaponPanelState)
    {
        this.uiState = state

        this.weaponItems.forEach(item => item.SetSelected(false))

        let equippedIds = DataManager.GetInstance().GetEquippedWeapon()

        if (state === "normal")
        {
            this.textBlueButton.Text = "Equip Best"
            this.textOrangeButton.Text = "Unequip All"
            this.textRedButton.Text = "Multi Sell"

            equippedIds.forEach(guid => this.AddWeaponItem(guid))
            this.EquipWeapon(equippedIds)
            this.ReOrderWeaponItems()

            return
        }

        if (state === "multi sell")
        {
            this.textBlueButton.Text = "Select All"
            this.textOrangeButton.Text = "Cancel"
            this.textRedButton.Text = "Sell"

            equippedIds.forEach(guid => this.RemoveWeaponItem(guid))
            return
        }
    }

    //设置可交互性
    public SetInterActive(flag: boolean)
    {
        this.buttons.forEach(button => button.SetInteroperable(flag))
    }

    //设置显示排序
    public SetDisplayOrder(number: number)
    {
        this.gui.DisplayOrder = number
    }

    //设置父对象
    public SetParent(parent: Instance)
    {
        this.gui.Parent = parent
    }

    //播放显示动效
    public ShowAnim()
    {
        this.innerUIScale.Scale = 0
        TweenService.Create(
            this.innerUIScale,
            new TweenInfo(0.2, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
            { Scale: 1 }
        ).Play()
    }

    //销毁ui对象
    public Destroy()
    {
        this.gui.Destroy()
    }

    private ReOrderWeaponItems()
    {
        let itemArr: [attackValue: number, item: WeaponItemButton, guid: string][] = []
        this.weaponItems.forEach((item, guid) =>
        {
            let weapon = DataManager.GetInstance().GetWeapon(guid)
            let config = WeaponConfigCollection.GetConfigById(weapon.Id)
            itemArr.push([config.Strength, item, guid])
        })

        itemArr = itemArr.sort((left, right) => left[0] > right[0])
        itemArr.forEach(([_, item, guid], index) =>
        {
            let equippedWeapon = DataManager.GetInstance().GetEquippedWeapon()

            let isEquipped = equippedWeapon.find(ele => ele === guid)
            item.SetListOrder(isEquipped ? 0 : index + 1)
        })
    }
}