/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 14:46:19
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-02 16:21:45
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

import { Players, ReplicatedStorage, RunService, UserInputService, Workspace } from "@rbxts/services";
import Projectile from "shared/Projectile";

export default class GameTest {

    public Run(): void {
        // Players.LocalPlayer.GetMouse().Button1Down.Connect(() => {
        //     print("创建火球")
        //     new FireBall();
        // });

        // offsetCamera();

        RunService.Heartbeat.Connect(dt => {

        })

        UserInputService.InputBegan.Connect(input => {
            if (input.UserInputType === Enum.UserInputType.MouseWheel) {
                return Enum.ContextActionResult.Sink;
            }
        });

        let playerRoot: Part;
        let char: Model;

        Players.LocalPlayer.CharacterAdded.Connect(character => {
            char = character;
            let root = character.WaitForChild("RightHand");
            playerRoot = root as Part;
        });

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

        Players.LocalPlayer.GetMouse().Button1Down.Connect(() => {
            let camera = Workspace.CurrentCamera;
            let ray = camera!.ScreenPointToRay(camera!.ViewportSize.X / 2, camera!.ViewportSize.Y / 2);
            let dir = ray!.Direction.mul(1000);

            let dest = camera!.CFrame.LookVector.mul(1000);
            let p = new RaycastParams();
            p.FilterType = Enum.RaycastFilterType.Exclude;
            p.FilterDescendantsInstances = [char];
            let rayCastResult = Workspace.Raycast(ray.Origin, dir, p);
            if (rayCastResult) {
                print(rayCastResult.Instance.Name)
                dest = rayCastResult.Position;
            }

            new Projectile(1, 3, char).Cast(playerRoot.Position, dest, 10);

            print(math.huge)
        })
    }

}

function offsetCamera() {

    let char: Model;
    Players.LocalPlayer.CharacterAdded.Connect(c => char = c);
    let camera = Workspace.CurrentCamera;

    RunService.RenderStepped.Connect(dt => {
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

        if (root && camera && head) {
            print(root.CFrame.LookVector)

            let lookPosition = root.CFrame.mul(new CFrame(new Vector3(2, 2, 0))).Position;
            let cameraPosition = root.CFrame.mul(new CFrame(new Vector3(2, 2, 5))).Position;

            camera.CFrame = new CFrame(cameraPosition, lookPosition);
        }
    })
}

class FireBall {

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

    constructor() {
        this._model = new Instance("Part");
        this._model.CFrame = (Players.LocalPlayer.Character?.FindFirstChild("Head") as MeshPart).CFrame;
        this._model.CFrame = this._model.CFrame.mul(new CFrame(new Vector3(0, 0, -3)));
        this._model.Anchored = true;

        RunService.Heartbeat.Connect(dt => {
            if (this._model === undefined) {
                return;
            }

            const offset = new Vector3(0, 0, -this._speed * dt);
            const localOffset = new CFrame(offset);
            this._model.CFrame = this._model.CFrame.mul(localOffset);

            const region = new Region3(Vector3.zero, Vector3.one.mul(2));
            let result = Workspace.Spherecast(this._model.Position, 2, Vector3.zero)
            if (result) {
                print("检测到其他物体")
                print(result.Instance.Name)
            }

        })
        this._model.Parent = game.Workspace;
    }
}