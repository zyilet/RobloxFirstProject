/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 14:46:19
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-06 17:02:54
 * @FilePath: \RobloxFirstProject\src\client\GameTest.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 14:46:19
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-02 10:15:36
 * @FilePath: \RobloxFirstProject\src\client\GameTest.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { ContextActionService, Players, ReplicatedStorage, RunService, TweenService, UserInputService, Workspace } from "@rbxts/services";
import Projectile from "shared/Projectile";
import MovementSystem, { MovementType } from "./game/MovementSystem";
import { Clack, Keyboard } from "@rbxts/clack";
import GameObjLoader from "./game/GameObjLoader";
import MovingCtrl from "./game/MovingCtrl";
import { OneKM, MeterToStud } from "shared/Constants";
import { Transform } from "shared/Transform";

export default class GameTest
{

    public async Run(): Promise<void>
    {

        // new MovingCtrl().Init();

        let humanoid = GameObjLoader.GetInstance().GetHumanoid();
        let char = GameObjLoader.GetInstance().GetCharacter();
        let root = GameObjLoader.GetInstance().GetHumanoidRoot();
        let attachment = GameObjLoader.GetInstance().GetHumanoidRootAttachment();
        let keyboard = new Keyboard();
        let camera = GameObjLoader.GetInstance().GetCurrentCamera();
        let speed = 10;

        // this.Fly();

        // let wFlag = false;

        // ContextActionService.BindAction("test", (name, state, input) => {
        //     if (input.KeyCode === Enum.KeyCode.W) {
        //         if (state === Enum.UserInputState.Begin) {
        //             wFlag = true;
        //         }
        //         else {
        //             wFlag = false;
        //         }
        //     }
        // }, false, Enum.KeyCode.W, Enum.KeyCode.S, Enum.KeyCode.A, Enum.KeyCode.D,)

        // RunService.Heartbeat.Connect(dt => {
        //     if (wFlag) {
        //         let curPos = root.CFrame.Position;
        //         let targetPos = curPos.add(camera.CFrame.LookVector.Unit.mul(20).mul(dt));
        //         root.CFrame = new CFrame(targetPos)

        //     }
        // // })

        // MovementSystem.GetInstance().SetMovementType(MovementType.Ground);

        UserInputService.InputBegan.Connect((input, processed) =>
        {
            if (input.UserInputType === Enum.UserInputType.MouseButton1)
            {

                if (processed)
                {
                    return;
                }
                // let ray = camera.ViewportPointToRay(camera.ViewportSize.X / 2, camera.ViewportSize.Y / 2);
                // let dir = ray.Direction.Unit.mul(OneKM);

                // let endPos = Transform.PointLocalToWorld(camera.CFrame, new Vector3(0, 0, -MeterToStud(100)));
                // let startPos = (char.WaitForChild("RightHand") as Part).CFrame.Position;
                // let drawHandle = Transform.DrawLine(() => startPos, () => endPos);
                // let timer = 0;
                // let runHandle = RunService.Heartbeat.Connect(dt => {
                //     timer += dt
                //     if (timer >= 0.2) {
                //         runHandle.Disconnect();
                //         drawHandle();
                //     }
                // })

                
            }
        })

        // UserInputService.InputBegan.Connect((i, p) => {
        //     if (i.KeyCode === Enum.KeyCode.G) {
        //         MovementSystem.GetInstance().SetMovementType(MovementType.Default);
        //     }
        //     if (i.KeyCode === Enum.KeyCode.H) {
        //         MovementSystem.GetInstance().SetMovementType(MovementType.Ground);
        //     }
        // })


        // UserInputService.InputBegan.Connect((key, processed) => {

        //     if (key.KeyCode === Enum.KeyCode.F) {
        //         print("F")
        //         humanoid.SetStateEnabled(Enum.HumanoidStateType.Running, false);
        //         humanoid.SetStateEnabled(Enum.HumanoidStateType.Climbing, false);
        //         humanoid.SetStateEnabled(Enum.HumanoidStateType.FallingDown, false);
        //         humanoid.SetStateEnabled(Enum.HumanoidStateType.Freefall, false);
        //         humanoid.ChangeState(Enum.HumanoidStateType.Flying);
        //     }

        //     if (key.KeyCode === Enum.KeyCode.V) {
        //         print("V")
        //         humanoid.SetStateEnabled(Enum.HumanoidStateType.Running, true);
        //         humanoid.SetStateEnabled(Enum.HumanoidStateType.Climbing, true);
        //         humanoid.SetStateEnabled(Enum.HumanoidStateType.FallingDown, true);
        //         humanoid.SetStateEnabled(Enum.HumanoidStateType.Freefall, true);
        //         humanoid.ChangeState(Enum.HumanoidStateType.Running);
        //     }
        // })

        // humanoid.ChangeState(Enum.HumanoidStateType.Physics);
        // let t = new Instance("VectorForce", humanoid);
        // t.Force = new Vector3(0, root.AssemblyMass * Workspace.Gravity, 0);
        // t.RelativeTo = Enum.ActuatorRelativeTo.World;
        // t.Attachment0 = GameObjLoader.GetInstance().GetHumanoidRootAttachment();


        // ContextActionService.BindAction("Fly", (name, state, input) => {
        //     if (state === Enum.UserInputState.End) {
        //         return Enum.ContextActionResult.Pass;
        //     }


        //     // if (humanoid.GetState() === Enum.HumanoidStateType.Jumping) {
        //     //     humanoid.Jump = true;
        //     // }

        //     // return Enum.ContextActionResult.Pass;
        // }, false, Enum.KeyCode.Space)

        // RunService.Heartbeat.Connect(dt => {
        //     if (keyboard.isKeyDownAllowProcessed(Enum.KeyCode.Space)) {
        //         humanoid.ChangeState(Enum.HumanoidStateType.Flying);
        //         let moveVector = new Vector3(0, 1, 0).mul(speed);
        //         humanoid.Move(moveVector);
        //     }
        //     else {
        //         humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
        //     }
        // })


        // offsetCamera();

        // RunService.Heartbeat.Connect(dt => {

        // })

        // UserInputService.InputBegan.Connect(input => {
        //     if (input.UserInputType === Enum.UserInputType.MouseWheel) {
        //         return Enum.ContextActionResult.Sink;
        //     }
        // });

        // let playerRoot: Part;
        // let char: Model;

        // Players.LocalPlayer.CharacterAdded.Connect(character => {
        //     char = character;
        //     let root = character.WaitForChild("RightHand");
        //     playerRoot = root as Part;
        // });

        // Players.LocalPlayer.GetMouse().Button1Down.Connect(() => {
        //     // //在玩家的位置创建一个part
        //     // let part = new Instance("Part");
        //     // let params = new RaycastParams();
        //     // part.Position = playerRoot.Position;
        //     // part.Parent = Workspace;
        //     // params.FilterDescendantsInstances = [Workspace];

        //     // //在玩家的位置进行一次范围测试
        //     // let result = Workspace.Spherecast(playerRoot.Position, 256, part.CFrame.LookVector.mul(100), params);
        //     // print(result?.Instance.Name);

        //     let result = Workspace.Spherecast(playerRoot.Position, 5, playerRoot.CFrame.LookVector.mul(5));
        //     print(result);
        // });

        // Players.LocalPlayer.GetMouse().Button1Down.Connect(() => {
        //     let camera = Workspace.CurrentCamera;
        //     let ray = camera!.ScreenPointToRay(camera!.ViewportSize.X / 2, camera!.ViewportSize.Y / 2);
        //     let dir = ray!.Direction.mul(1000);

        //     let dest = camera!.CFrame.LookVector.mul(1000);
        //     let p = new RaycastParams();
        //     p.FilterType = Enum.RaycastFilterType.Exclude;
        //     p.FilterDescendantsInstances = [char];
        //     let rayCastResult = Workspace.Raycast(ray.Origin, dir, p);
        //     if (rayCastResult) {
        //         dest = rayCastResult.Position;
        //     }

        //     new Projectile(1, 3, char).Cast(playerRoot.Position, dest, 10);
        // })
    }

    public Fly()
    {
        let hoverAnimID = "rbxassetid://15258521332"
        let flyAnimID = "rbxassetid://15258519734"

        let hoverAnim = new Instance("Animation");
        hoverAnim.AnimationId = hoverAnimID;
        let flyAnim = new Instance("Animation");
        flyAnim.AnimationId = flyAnimID

        let isFlying = false;
        let humanoid = GameObjLoader.GetInstance().GetHumanoid();
        let char = GameObjLoader.GetInstance().GetCharacter();
        let root = GameObjLoader.GetInstance().GetHumanoidRoot();
        let animator = humanoid.WaitForChild("Animator") as Animator;
        let camera = GameObjLoader.GetInstance().GetCurrentCamera()
        let frictionOringin = root.Friction;

        let bodyVelocity = new Instance("BodyVelocity", char)
        let bodyGyro = new Instance("BodyGyro", char)
        bodyGyro.MaxTorque = Vector3.one.mul(10000)
        bodyGyro.P = 10000;

        let hover = animator.LoadAnimation(hoverAnim);
        let fly = animator.LoadAnimation(flyAnim);

        let getFlyDir = () =>
        {
            if (humanoid.MoveDirection === Vector3.zero)
            {
                return humanoid.MoveDirection;
            }

            let cameraPos = camera.CFrame.Position;
            let cameraLookExcludeY = new Vector3(camera.CFrame.LookVector.X, 0, camera.CFrame.LookVector.Z);

            let pos = new CFrame(cameraPos, cameraPos.add(cameraLookExcludeY)).VectorToObjectSpace(humanoid.MoveDirection);
            let dir = (camera.CFrame.mul(new CFrame(pos))).Position.sub(camera.CFrame.Position);

            if (dir === new Vector3())
            {
                return dir
            }
            else
            {
                return dir.Unit
            }
        }

        RunService.RenderStepped.Connect(() =>
        {
            if (!char)
            {
                return
            }
            if (!isFlying)
            {
                return
            }
            bodyGyro.CFrame = camera.CFrame;
            humanoid.ChangeState(Enum.HumanoidStateType.Flying)
            TweenService.Create(bodyVelocity, new TweenInfo(0.3), { Velocity: getFlyDir().mul(MeterToStud(20)) }).Play();
        })


        UserInputService.InputBegan.Connect((input, processed) =>
        {
            if (processed)
            {
                return;
            }
            if (input.KeyCode !== Enum.KeyCode.Space)
            {
                return;
            }

            if (humanoid.GetState() !== Enum.HumanoidStateType.Freefall && humanoid.GetState() !== Enum.HumanoidStateType.Flying)
            {
                return;
            }

            if (isFlying)
            {
                //切换成地面状态
                isFlying = false;
                humanoid.SetStateEnabled(Enum.HumanoidStateType.Running, true);
                humanoid.SetStateEnabled(Enum.HumanoidStateType.Climbing, true);
                humanoid.SetStateEnabled(Enum.HumanoidStateType.FallingDown, true);
                humanoid.SetStateEnabled(Enum.HumanoidStateType.Freefall, true);
                humanoid.ChangeState(Enum.HumanoidStateType.Running);
                root.Friction = frictionOringin;
                bodyVelocity.Parent = char;
                bodyGyro.Parent = char;
                hover.Stop()
                fly.Stop();
            }
            else
            {
                //切换为飞行状态
                isFlying = true;
                hover.Play(0.1, 1, 1);
                humanoid.SetStateEnabled(Enum.HumanoidStateType.Running, false);
                humanoid.SetStateEnabled(Enum.HumanoidStateType.Climbing, false);
                humanoid.SetStateEnabled(Enum.HumanoidStateType.FallingDown, false);
                humanoid.SetStateEnabled(Enum.HumanoidStateType.Freefall, false);
                humanoid.ChangeState(Enum.HumanoidStateType.Flying);
                root.Friction = 0;
                bodyVelocity.Parent = root;
                bodyGyro.Parent = root;
            }
        })
    }

}

function offsetCamera()
{

    let char: Model;
    Players.LocalPlayer.CharacterAdded.Connect(c => char = c);
    let camera = Workspace.CurrentCamera;

    RunService.RenderStepped.Connect(dt =>
    {
        // if (!camera) return;
        // if (char) {
        //     const head = char.FindFirstChild("Head") as Part;
        //     if (head) {
        //         camera.CFrame = camera.CFrame.add(camera.CFrame.PointToObjectSpace(new Vector3(0, 2, 0)))
        //     }
        // }

        let root = Players.LocalPlayer.Character?.FindFirstChild("HumanoidRootPart") as Part;
        let head = Players.LocalPlayer.Character?.FindFirstChild("Head") as MeshPart;
        let camera = Workspace.CurrentCamera;

        if (root && camera && head)
        {
            print(root.CFrame.LookVector)

            let lookPosition = root.CFrame.mul(new CFrame(new Vector3(2, 2, 0))).Position;
            let cameraPosition = root.CFrame.mul(new CFrame(new Vector3(2, 2, 5))).Position;

            camera.CFrame = new CFrame(cameraPosition, lookPosition);
        }
    })
}

class FireBall
{

    private _model?: Part;
    private _speed: number = 200;

    // constructor() {
    //     this._model = ReplicatedStorage.WaitForChild("FireBall").Clone() as Part;
    //     this._model.CFrame = (Players.LocalPlayer.Character?.FindFirstChild("Head") as MeshPart).CFrame;

    //     this._model.Touched.Connect(other => {
    //         print("碰到了其他物体")
    //         this._model?.Destroy();
    //     })

    //     RunService.Heartbeat.Connect(dt => {
    //         if (this._model === undefined) {
    //             return;
    //         }

    //         const offset = new Vector3(0, 0, -this._speed * dt);
    //         const localOffset = new CFrame(offset);
    //         this._model.CFrame = this._model.CFrame.mul(localOffset);

    //         const region = new Region3(Vector3.zero, Vector3.one.mul(2));
    //     })
    //     this._model.Parent = game.Workspace;
    // }

    constructor()
    {
        this._model = new Instance("Part");
        this._model.CFrame = (Players.LocalPlayer.Character?.FindFirstChild("Head") as MeshPart).CFrame;
        this._model.CFrame = this._model.CFrame.mul(new CFrame(new Vector3(0, 0, -3)));
        this._model.Anchored = true;

        RunService.Heartbeat.Connect(dt =>
        {
            if (this._model === undefined)
            {
                return;
            }

            const offset = new Vector3(0, 0, -this._speed * dt);
            const localOffset = new CFrame(offset);
            this._model.CFrame = this._model.CFrame.mul(localOffset);

            const region = new Region3(Vector3.zero, Vector3.one.mul(2));
            let result = Workspace.Spherecast(this._model.Position, 2, Vector3.zero)
            if (result)
            {
                print("检测到其他物体")
                print(result.Instance.Name)
            }

        })
        this._model.Parent = game.Workspace;
    }


}