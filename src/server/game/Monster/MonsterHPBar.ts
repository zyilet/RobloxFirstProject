export class MonsterHPBar
{
    private _backImg: ImageLabel;
    private _frontImg: ImageLabel;

    constructor(gui: BillboardGui)
    {
        this._backImg = gui.WaitForChild("Frame").WaitForChild("Back") as ImageLabel
        this._frontImg = gui.WaitForChild("Frame").WaitForChild("Front") as ImageLabel
    }

    /**
     * @description: [0,1]
     * @return {*}
     */
    public SetRatio(ratio: number)
    {
        this._frontImg.Size = new UDim2(ratio, 0, 1, 0)
    }
}