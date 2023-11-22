// import { PetConfigCollection } from "shared/GameConfig/PetConfig"
// import { PetManager } from "./PetManager"

// export class Pet
// {
//     private humanoid?: Humanoid
//     private runTrack?: AnimationTrack
//     private idleTrack?: AnimationTrack
//     private model?: Model

//     public Init(id: string, player: Player)
//     {
//         let config = PetConfigCollection.GetConfigById(id)
//         let cache = PetManager.PetModelCache.get(config.assetId)
//         if (cache?.state === "Loaded")
//         {
//             this.model = cache.model.Clone()
//             this.humanoid = this.model.WaitForChild("Humanoid") as Humanoid

//             let animator = this.humanoid.WaitForChild("Animator") as Animator
//             let idleAnim = this.model.WaitForChild("Animations").WaitForChild("Idle") as Animation
//             let runAnim = this.model.WaitForChild("Animations").WaitForChild("Run") as Animation

//             this.idleTrack = animator.LoadAnimation(idleAnim)
//             this.runTrack = animator.LoadAnimation(runAnim)
//         }
//         else
//         {
//             error("缓存异常")
//         }
//     }

//     public Update(dt: number)
//     {

//     }

//     public Destroy()
//     {
//         this.model?.Destroy()
//         this.runTrack?.Destroy()
//         this.idleTrack?.Destroy()
//     }
// }