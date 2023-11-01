/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 14:46:19
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-01 17:36:30
 * @FilePath: \RobloxFirstProject\src\client\GameTest.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";

export default class GameTest {


    public Run(): void {
        Players.LocalPlayer.GetMouse().Button1Down.Connect(() => {
            print("创建火球")
            new FireBall();
        });
    }

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

        this._model.Touched.Connect(other => {
            print("碰到了其他物体")
            this._model?.Destroy();
        })

        RunService.Heartbeat.Connect(dt => {
            if (this._model === undefined) {
                return;
            }

            const offset = new Vector3(0, 0, -this._speed * dt);
            const localOffset = new CFrame(offset);
            this._model.CFrame = this._model.CFrame.mul(localOffset);

            const region = new Region3(Vector3.zero, Vector3.one.mul(2));
        })
        this._model.Parent = game.Workspace;
    }
}