import { Workspace } from "@rbxts/services"
import { AssetCacheManager } from "shared/AssetCache/AssetCacheManager"
import { PetConfigCollection } from "shared/GameConfig/PetConfig"


type State = "idle" | "follow"

export class Pet
{
    private humanoid?: Humanoid
    private runTrack?: AnimationTrack
    private idleTrack?: AnimationTrack
    private model?: Model
    private player?: Player
    private state: State = "idle"
    private preState: State = "idle"

    public Init(id: string, player: Player)
    {
        let config = PetConfigCollection.GetConfigById(id)
        let petModel = AssetCacheManager.GetInstance().GetAsset<Model>(config.assetId).Clone()

        petModel.Parent = Workspace
        petModel.WaitForChild("HumanoidRootPart")

        this.player = player
        this.humanoid = petModel.WaitForChild("Humanoid") as Humanoid

        let animator = this.humanoid.WaitForChild("Animator") as Animator
        let idleAnim = petModel.WaitForChild("Animations").WaitForChild("Idle") as Animation
        let runAnim = petModel.WaitForChild("Animations").WaitForChild("Run") as Animation

        this.idleTrack = animator.LoadAnimation(idleAnim)
        this.runTrack = animator.LoadAnimation(runAnim)

        this.Idle(true)
    }

    public Update(dt: number)
    {
        if (this.state === "idle")
        {

        }
        if (this.state === "follow")
        {

        }
    }

    public Destroy()
    {
        this.model?.Destroy()
        this.runTrack?.Destroy()
        this.idleTrack?.Destroy()
    }

    private Idle(init: boolean)
    {
        //从别的状态切换过来
        if (init)
        {
            this.idleTrack?.Play()

        }

        //切换到跟随状态
        if (this.GetDistanceToPlayer() > 5)
        {
            this.idleTrack?.Stop()
            this.state = "follow"
            return
        }

        if (this.idleTrack?.IsPlaying)
        {

        }
    }
    private Follow(init: boolean)
    {

    }

    private GetDistanceToPlayer()
    {
        let playerRoot = this.player?.Character?.WaitForChild("HumanoidRootPart") as Part
        let petRoot = this.model?.WaitForChild("HumanoidRootPart") as Part
        if (playerRoot === undefined || petRoot === undefined)
        {
            return 0
        }
        else
        {
            return playerRoot.CFrame.Position.sub(petRoot.CFrame.Position).Magnitude
        }
    }
}