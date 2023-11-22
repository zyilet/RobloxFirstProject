// import { Players, Workspace } from "@rbxts/services"
// import { Transform } from "shared/Transform";

// type State = "Run" | "Idle" | "None"

// export class Pet
// {
//     private playerModel: Model | undefined;
//     private PlayerRoot: Part | undefined;
//     private petModel: Model
//     private petRoot: Part
//     private humanoid: Humanoid;
//     private animator: Animator
//     private preState: State = "None"
//     private state: State = "Idle"
//     private runAnim: Animation
//     private idleAnim: Animation
//     private runTrack: AnimationTrack
//     private idleTrack: AnimationTrack

//     constructor()
//     {
//         this.petModel = Workspace.WaitForChild("Pet") as Model
//         this.petRoot = this.petModel.WaitForChild("HumanoidRootPart") as Part
//         this.humanoid = this.petModel.WaitForChild("Humanoid") as Humanoid
//         this.animator = this.humanoid.WaitForChild("Animator") as Animator
//         this.runAnim = this.petModel.WaitForChild("Animate").WaitForChild("run").WaitForChild("RunAnim") as Animation
//         this.idleAnim = this.petModel.WaitForChild("Animate").WaitForChild("idle").WaitForChild("Animation1") as Animation
//         this.runTrack = this.animator.LoadAnimation(this.runAnim)
//         this.idleTrack = this.animator.LoadAnimation(this.idleAnim)

//         Players.PlayerAdded.Connect(player =>
//         {
//             if (this.playerModel)
//             {
//                 return
//             }

//             this.playerModel = player.CharacterAdded.Wait()[0]
//             this.PlayerRoot = this.playerModel.WaitForChild("HumanoidRootPart") as Part
//         })

//         this.humanoid.MoveToFinished.Connect(result =>
//         {
//             this.state = "Idle"
//         })
//     }

//     public Update(dt: number)
//     {
//         if (!this.playerModel || !this.PlayerRoot)
//         {
//             return
//         }

//         if (this.state === "None")
//         {
//             this.state = "Idle"
//         }

//         if (this.state === "Idle")
//         {
//             this.Idle(this.preState === this.state)
//         }

//         if (this.state === "Run")
//         {
//             this.Run(this.preState === this.state)
//         }
//     }

//     private Idle(init: boolean)
//     {
//         if (init)
//         {
//             this.preState = "Idle"
//             this.idleTrack.Play()
//         }

//         if (!this.PlayerRoot)
//             return

//         if (!this.idleTrack.IsPlaying)
//         {
//             this.idleTrack.Play()
//         }

//         if (this.PlayerRoot.CFrame.Position.sub(this.petRoot.CFrame.Position).Magnitude >= 10)
//         {
//             this.idleTrack.Stop()
//             this.state = "Run"
//         }
//     }
//     private Run(init: boolean)
//     {
//         if (init)
//         {
//             this.preState = "Run"
//             this.runTrack.Play()
//         }
//         if (!this.PlayerRoot)
//             return

//         if (!this.runTrack.IsPlaying)
//         {
//             this.runTrack.Play()
//         }

//         this.humanoid.MoveTo(this.PlayerRoot!.CFrame.Position)

//         if (this.PlayerRoot.CFrame.Position.sub(this.petRoot.CFrame.Position).Magnitude <= 5)
//         {
//             this.humanoid.MoveTo(this.petRoot.CFrame.Position)
//             this.runTrack.Stop()
//             this.state = "Idle"
//         }
//     }
// }