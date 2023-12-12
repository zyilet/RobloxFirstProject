import { Players, TweenService, Workspace } from "@rbxts/services"
import { ScalableButton } from "../Base/ScalableButton"
import { Subscribable } from "../UIEvent"
import { UITools } from "../UITools"

export class WeaponInfoPanelGui
{
    private gui: ScreenGui
    private outerFrame: Frame
    private fitScale: UIScale
    private fadeScale: UIScale
    private textName: TextLabel
    private textAttack: TextLabel
    private btnClose: ScalableButton
    private btnEquip: ScalableButton
    private btnUnEquip: ScalableButton
    private btnSell: ScalableButton
    private btnCancel: ScalableButton

    public OnBtnCloseClick: Subscribable
    public OnBtnEquipClick: Subscribable
    public OnBtnUnEquipClick: Subscribable
    public OnBtnSellClick: Subscribable
    public OnBtnCancelClick: Subscribable

    constructor()
    {
        this.gui = UITools.LoadGui("WeaponInfoPanel")
        this.outerFrame = UITools.FindEle(this.gui, "Outer")
        this.fitScale = UITools.FindEle(this.gui, "FitScale")
        this.fadeScale = UITools.FindEle(this.gui, "FadeScale")

        this.textName = UITools.FindEle(this.gui, "TextName")
        this.textAttack = UITools.FindEle(this.gui, "TextAttack")
        this.btnClose = new ScalableButton(UITools.FindEle(this.gui, "BtnClose"))
        this.btnEquip = new ScalableButton(UITools.FindEle(this.gui, "BtnEquip"))
        this.btnUnEquip = new ScalableButton(UITools.FindEle(this.gui, "BtnUnEquip"))
        this.btnSell = new ScalableButton(UITools.FindEle(this.gui, "BtnSell"))
        this.btnCancel = new ScalableButton(UITools.FindEle(this.gui, "BtnCancel"))

        this.OnBtnCloseClick = this.btnClose.OnClick
        this.OnBtnEquipClick = this.btnEquip.OnClick
        this.OnBtnUnEquipClick = this.btnUnEquip.OnClick
        this.OnBtnSellClick = this.btnSell.OnClick
        this.OnBtnCancelClick = this.btnCancel.OnClick

        this.btnEquip.SetVisible(false)
        this.btnUnEquip.SetVisible(false)

        this.fitScale.Scale = (Workspace.CurrentCamera?.ViewportSize.Y ?? 1440) / 1440
    }

    public Destroy()
    {
        this.gui.Destroy()
    }

    public SetParent(parent: Instance)
    {
        this.gui.Parent = parent
    }

    public SetDepth(depth: number)
    {
        this.gui.DisplayOrder = depth
    }

    public SetName(name: string)
    {
        this.textName.Text = name
    }

    public SetAttack(attack: number)
    {
        this.textAttack.Text = tostring(`Atk: ${attack}`)
    }

    public SetEquipBtnState(state: "equip" | "unequip")
    {
        this.btnEquip.SetVisible(state === "unequip")
        this.btnUnEquip.SetVisible(state === "equip")
    }

    public SetPosition(position: UDim2)
    {
        let viewportSize = Workspace.CurrentCamera!.ViewportSize
        let guiSize = this.outerFrame.AbsoluteSize

        let targetX = position.X.Offset
        let targetY = position.Y.Offset

        //检查是否超过右边界
        if (position.X.Offset + guiSize.X > viewportSize.X)
        {
            targetX = viewportSize.X - guiSize.X
        }
        //检查是否超过下边界
        if (position.Y.Offset + guiSize.Y > viewportSize.Y)
        {
            targetY = viewportSize.Y - guiSize.Y
        }

        this.outerFrame.Position = new UDim2(0, targetX, 0, targetY)
    }

    public ShowAnim()
    {
        this.fadeScale.Scale = 0
        TweenService.Create(
            this.fadeScale,
            new TweenInfo(0.2, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
            { Scale: 1 }
        ).Play()
    }
}