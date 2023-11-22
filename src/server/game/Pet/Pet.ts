import { AnimationClipProvider, Workspace } from "@rbxts/services"
import { AssetCacheManager } from "shared/AssetCache/AssetCacheManager"
import { PetConfigCollection } from "shared/GameConfig/PetConfig"
import { Transform } from "shared/Transform"


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

        this.model = AssetCacheManager.GetInstance().GetAsset<Model>(config.assetId).Clone()
        this.player = player
        this.humanoid = this.model.WaitForChild("Humanoid") as Humanoid

        this.TransmitToPlayer()
        this.model.Parent = Workspace

        let animator = this.humanoid.WaitForChild("Animator") as Animator
        let idleAnim = this.model.WaitForChild("Animations").WaitForChild("Idle") as Animation
        let runAnim = this.model.WaitForChild("Animations").WaitForChild("Run") as Animation

        this.idleTrack = animator.LoadAnimation(idleAnim)
        this.runTrack = animator.LoadAnimation(runAnim)
        this.idleTrack.Looped = true
        this.runTrack.Looped = true

        this.Idle(true)

        return this
    }

    public Update(dt: number)
    {
        if (this.state === "idle")
        {
            this.Idle(this.preState === this.state)
        }
        if (this.state === "follow")
        {
            this.Follow(this.preState === this.state)
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
            this.preState = "idle"
        }

        if (this.idleTrack?.IsPlaying === false)
        {
            this.idleTrack.Play()
        }

        //切换到跟随状态
        if (this.GetDistanceToPlayer() > 10)
        {
            this.idleTrack?.Stop()
            this.state = "follow"
        }
    }
    private Follow(init: boolean)
    {
        if (init)
        {
            this.runTrack?.Play()
            this.preState = "follow"
        }

        this.MoveToPlayer()
        if (this.runTrack?.IsPlaying === false)
        {
            this.runTrack.Play()
        }

        if (this.GetDistanceToPlayer() < 5)
        {
            this.runTrack?.Stop()
            this.state = "idle"
        }
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

    private TransmitToPlayer()
    {
        let playerRoot = this.player?.Character?.WaitForChild("HumanoidRootPart") as Part
        let petRoot = this.model?.WaitForChild("HumanoidRootPart") as Part

        while (!playerRoot || !petRoot)
        {
            task.wait()
            playerRoot = this.player?.Character?.WaitForChild("HumanoidRootPart") as Part
            petRoot = this.model?.WaitForChild("HumanoidRootPart") as Part
        }

        let transmitPos = Transform.PointLocalToWorld(playerRoot.CFrame, new Vector3(0, 0, 5))
        petRoot.CFrame = new CFrame(transmitPos, playerRoot.CFrame.Position)
    }

    private MoveToPlayer()
    {
        let playerRoot = this.player?.Character?.WaitForChild("HumanoidRootPart") as Part

        this.humanoid?.MoveTo(Transform.PointLocalToWorld(playerRoot.CFrame, new Vector3(0, 0, 3)))
    }
}