import { Subscribable, UIEvent } from "../UIEvent"
import { UITools } from "../UITools"

export class ScalableButton
{
    protected root: Frame
    protected inner: Frame
    protected clickMask: Frame
    protected uiScale: UIScale
    protected clickEvent: UIEvent

    public OnClick: Subscribable
    public Root: Frame


    constructor(root: Frame)
    {
        this.root = root
        this.inner = UITools.FindEle(root, "Inner")
        this.clickMask = UITools.FindEle(root, "ClickMask")
        this.uiScale = UITools.FindEle(root, "UIScale")

        this.clickEvent = new UIEvent()
        this.OnClick = this.clickEvent.CreateSubscribable()

        this.Root = this.root
        this.InitDE()
    }

    public SetInteroperable(flag: boolean)
    {
        this.clickMask.Visible = flag
    }

    public Destroy()
    {
        this.root.Destroy()
    }

    private InitDE()
    {
        //声音
        let sound = new Instance("Sound")
        sound.SoundId = "rbxassetid://7249903719"
        sound.Parent = this.inner

        let isInUI = true
        this.clickMask.InputBegan.Connect(input =>
        {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 ||
                input.UserInputType === Enum.UserInputType.Touch)
            {
                this.uiScale.Scale = 0.9
                sound.Play()
            }
        })
        this.clickMask.InputEnded.Connect(input =>
        {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 ||
                input.UserInputType === Enum.UserInputType.Touch)
            {
                this.uiScale.Scale = 1

                //检查输入坐标是否还在该ui对象的范围之内
                let left = this.clickMask.AbsolutePosition.X + 1
                let right = this.clickMask.AbsolutePosition.X + this.clickMask.AbsoluteSize.X - 1
                let top = this.clickMask.AbsolutePosition.Y + 1
                let bottom = this.clickMask.AbsolutePosition.Y + this.clickMask.AbsoluteSize.Y - 1
                if (input.Position.X > left && input.Position.X < right &&
                    input.Position.Y > top && input.Position.Y < bottom)
                {
                    this.clickEvent.Publish()
                }
            }
        })

    }
}