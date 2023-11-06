/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-02 11:57:18
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-06 09:52:48
 * @FilePath: \RobloxFirstProject\src\shared\Projectile.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Debris, RunService, TweenService, Workspace } from "@rbxts/services";
import { MeterToStud } from "./Constants";

export default class Projectile {

    private _gravity: number;
    private _survival: number;
    private _raycastParams: RaycastParams;

    constructor(gravity: number, survival: number, exclude: Instance) {
        this._gravity = gravity;
        this._survival = survival;
        this._raycastParams = new RaycastParams();
        this._raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
        this._raycastParams.FilterDescendantsInstances = [exclude];
    }


    public Cast(start: Vector3, dest: Vector3, force: number) {

        //将roblox的重力转化成现实重力
        const conversion = 196.2 / 9.8;

        let vForce = dest.sub(start).Unit.mul(force).mul(conversion);
        let a = new Vector3(0, this._gravity * 9.8, 0).mul(conversion);
        let t = 0;
        let curPos = start;
        let rayResult: RaycastResult | undefined;
        let found = false;


        let part = new Instance("Part");

        let connect = RunService.Heartbeat.Connect(dt => {

            if (found) return;

            t += dt;

            let nextPos = new Vector3(
                start.X + vForce.X * t,
                start.Y + vForce.Y * t,
                start.Z + vForce.Z * t,
            );

            rayResult = Workspace.Raycast(curPos, nextPos.sub(curPos), this._raycastParams);
            curPos = nextPos;

            //创建轨迹
            // let part = new Instance("Part");
            part.Size = Vector3.one.mul(MeterToStud(1));
            part.CastShadow = false;
            part.Position = nextPos;
            part.Anchored = true;
            part.CanCollide = false;
            part.Material = Enum.Material.Neon;
            part.Color = new Color3(1, 0, 0);
            part.Shape = Enum.PartType.Ball;
            part.Parent = Workspace;
            // Debris.AddItem(part, 0.5);

            if (rayResult || t > this._survival) {
                found = true;
            }
        })

        while (!found) {
            wait()
        }

        connect.Disconnect();

        if (rayResult) {
            print(rayResult.Instance.Name)

            let tween = TweenService.Create(part, new TweenInfo(0.2), { Size: Vector3.one.mul(MeterToStud(5)), Transparency: 0 });
            tween.Play()
            wait(0.2);
            tween.Cancel();
            part.Destroy();
        } else {
            part.Destroy();
        }
    }
}