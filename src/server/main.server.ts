/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 13:47:40
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-07 13:42:09
 * @FilePath: \RobloxFirstProject\src\server\main.server.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { KnitServer as knit } from "@rbxts/knit";
import { Component } from "@rbxts/knit";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

knit.AddServices(script.Parent!.FindFirstChild('services') as Folder)
// Component.Auto(script.Parent!.FindFirstChild("components") as Folder)

knit.Start()
    .andThen(() =>
    {
        print("Server Start")

        let remoteEvent = ReplicatedStorage.WaitForChild("TestEvent") as RemoteEvent;

        remoteEvent.OnServerEvent.Connect((player, info) =>
        {
            print(`${player.Name}: ${info}`);
        })
    })
    .catch(warn)