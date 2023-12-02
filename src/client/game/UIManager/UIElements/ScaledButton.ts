import { TweenService } from "@rbxts/services"
import { CustomEvent, Subscribable } from "shared/SubscribableEvent"

type Action = { (): void }

export class ScaledButton
{
    private uiEle: Frame
    private clickMask: Frame
    private clickEvent: CustomEvent

    public OnClick: Subscribable

    constructor(uiEle: Frame)
    {
        this.uiEle = uiEle

        let elements = uiEle.GetDescendants()
        this.clickMask = elements.find(ele => ele.Name === "ClickMask") as Frame
        this.clickEvent = new CustomEvent()
        this.OnClick = this.clickEvent.CreateSubscribable()


        this.InitDE()
    }

    private InitDE()
    {
        let scaleRatio = 0.9
        let originSize = this.uiEle.Size
        let smallerSize = new UDim2(
            originSize.Height.Scale * scaleRatio,
            originSize.Height.Offset * scaleRatio,
            originSize.Width.Scale * scaleRatio,
            originSize.Width.Offset * scaleRatio
        )

        let isInUi = false

        this.clickMask.InputBegan.Connect(input =>
        {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 ||
                input.UserInputType === Enum.UserInputType.Touch)
            {
                // TweenService.Create(this.uiEle, new TweenInfo(0.5), { Size: smallerSize }).Play()
                this.uiEle.Size = smallerSize
            }
        })

        this.clickMask.InputEnded.Connect(input =>
        {

            if (input.UserInputType === Enum.UserInputType.MouseButton1 ||
                input.UserInputType === Enum.UserInputType.Touch)
            {
                // TweenService.Create(this.uiEle, new TweenInfo(0.2), { Size: originSize }).Play()
                this.uiEle.Size = originSize
                print(isInUi)
                if (isInUi)
                {
                    this.clickEvent.Publish()
                }
            }
        })

        this.clickMask.MouseEnter.Connect(() => isInUi = true)
        this.clickMask.MouseLeave.Connect(() => isInUi = false)
    }
}