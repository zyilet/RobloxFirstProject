import { Players, Workspace } from "@rbxts/services"
import { UITools } from "../UITools"
import { ScalableButton } from "../Base/ScalableButton"
import { Subscribable } from "../UIEvent"

export class MainPanelGui
{
    private gui: ScreenGui
    private fitScales: UIScale[]

    private btnAscend: ScalableButton
    private btnSkill: ScalableButton
    private btnWeapon: ScalableButton
    private btnPet: ScalableButton
    private btnMail: ScalableButton
    private btnHunting: ScalableButton
    private btnTopUp: ScalableButton
    private btnSignIn: ScalableButton
    private btnHightAutoSwing: ScalableButton
    private btnLowAutoSwing: ScalableButton
    private btnGold: ScalableButton
    private btnAttack: ScalableButton
    private btnTransfer: ScalableButton
    private btnRank: ScalableButton
    private btnShop: ScalableButton

    public OnBtnAscendClick: Subscribable
    public OnBtnSkillClick: Subscribable
    public OnBtnWeaponClick: Subscribable
    public OnBtnPetClick: Subscribable
    public OnBtnMailClick: Subscribable
    public OnBtnHuntingClick: Subscribable
    public OnBtnTopUpClick: Subscribable
    public OnBtnSignInClick: Subscribable
    public OnBtnHightAutoSwingClick: Subscribable
    public OnBtnLowAutoSwingClick: Subscribable
    public OnBtnGoldClick: Subscribable
    public OnBtnAttackClick: Subscribable
    public OnBtnTransferClick: Subscribable
    public OnBtnRankClick: Subscribable
    public OnBtnShopClick: Subscribable


    constructor()
    {
        this.gui = UITools.LoadGui("MainPanel")

        this.fitScales = UITools.FindEles(this.gui, "FitScale")

        this.btnAscend = new ScalableButton(UITools.FindEle(this.gui, "BtnAscend"))
        this.btnSkill = new ScalableButton(UITools.FindEle(this.gui, "BtnSkill"))
        this.btnWeapon = new ScalableButton(UITools.FindEle(this.gui, "BtnWeapon"))
        this.btnPet = new ScalableButton(UITools.FindEle(this.gui, "BtnPet"))
        this.btnMail = new ScalableButton(UITools.FindEle(this.gui, "BtnMail"))
        this.btnHunting = new ScalableButton(UITools.FindEle(this.gui, "BtnHunting"))
        this.btnTopUp = new ScalableButton(UITools.FindEle(this.gui, "BtnTopUp"))
        this.btnSignIn = new ScalableButton(UITools.FindEle(this.gui, "BtnSignIn"))
        this.btnHightAutoSwing = new ScalableButton(UITools.FindEle(this.gui, "BtnHighAutoSwing"))
        this.btnLowAutoSwing = new ScalableButton(UITools.FindEle(this.gui, "BtnLowAutoSwing"))
        this.btnGold = new ScalableButton(UITools.FindEle(this.gui, "BtnGold"))
        this.btnAttack = new ScalableButton(UITools.FindEle(this.gui, "BtnAttack"))
        this.btnTransfer = new ScalableButton(UITools.FindEle(this.gui, "BtnTransfer"))
        this.btnRank = new ScalableButton(UITools.FindEle(this.gui, "BtnRank"))
        this.btnShop = new ScalableButton(UITools.FindEle(this.gui, "BtnShop"))

        this.OnBtnAscendClick = this.btnAscend.OnClick
        this.OnBtnSkillClick = this.btnSkill.OnClick
        this.OnBtnWeaponClick = this.btnWeapon.OnClick
        this.OnBtnPetClick = this.btnPet.OnClick
        this.OnBtnMailClick = this.btnMail.OnClick
        this.OnBtnHuntingClick = this.btnHunting.OnClick
        this.OnBtnTopUpClick = this.btnTopUp.OnClick
        this.OnBtnSignInClick = this.btnSignIn.OnClick
        this.OnBtnHightAutoSwingClick = this.btnHightAutoSwing.OnClick
        this.OnBtnLowAutoSwingClick = this.btnLowAutoSwing.OnClick
        this.OnBtnGoldClick = this.btnGold.OnClick
        this.OnBtnAttackClick = this.btnAttack.OnClick
        this.OnBtnTransferClick = this.btnTransfer.OnClick
        this.OnBtnRankClick = this.btnRank.OnClick
        this.OnBtnShopClick = this.btnShop.OnClick

        this.fitScales.forEach(scale => scale.Scale = Workspace.CurrentCamera!.ViewportSize.Y / 1440)

        this.gui.Parent = (Players.LocalPlayer.WaitForChild("PlayerGui"))
    }

    public SetDisplayOrder(depth: number)
    {
        this.gui.DisplayOrder = depth
    }

    Destroy()
    {
        this.gui.Destroy()
    }
}