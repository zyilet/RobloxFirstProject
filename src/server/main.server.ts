/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 13:47:40
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-08 11:33:38
 * @FilePath: \RobloxFirstProject\src\server\main.server.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { KnitServer as knit } from "@rbxts/knit";
import { Component } from "@rbxts/knit";
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { AttackableObjectManager } from "./game/AttackableObjectManager";

knit.AddServices(script.Parent!.FindFirstChild('services') as Folder)
// Component.Auto(script.Parent!.FindFirstChild("components") as Folder)

knit.Start()
    .andThen(() =>
    {
        print("Server Start")

        let attackableObjectManager = AttackableObjectManager.GetInstance();
        attackableObjectManager.Init()

        RunService.Heartbeat.Connect(dt =>
        {
            attackableObjectManager.Update(dt);
        })

        attackableObjectManager.StartSpawn();
    })
    .catch(warn)