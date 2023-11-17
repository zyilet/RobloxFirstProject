/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-07 14:29:16
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-14 15:30:08
 * @FilePath: \RobloxFirstProject\src\server\services\ProjectileService.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Workspace } from "@rbxts/services";
import { MeterToStud } from "shared/Constants";
import Projectile from "server/game/Projectile";
import { Transform } from "shared/Transform";

declare global
{
    interface KnitServices
    {
        ProjectileService: typeof ProjectileService;
    }
}

const ProjectileService = Knit.CreateService({
    Name: "ProjectileService",

    Client: {
        CastProjectile: new RemoteSignal<(startPos: Vector3, dir: Vector3) => void>()
    },

    KnitInit()
    {
        this.Client.CastProjectile.Connect((player, startPos, dir) =>
        {
            let char = player.Character;
            if (char)
            {
                new Projectile(1, 3, char, player).Cast(startPos, dir, MeterToStud(1));
            }
        })
    },

    KnitStart()
    {

    },
});

export = ProjectileService;