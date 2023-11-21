/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 13:47:40
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-18 14:45:43
 * @FilePath: \RobloxFirstProject\src\server\main.server.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Players, RunService } from "@rbxts/services";
import { MonsterManager } from "./game/Monster/MonsterManager";
import { GameDataManager } from "./game/DataStore/GameDataManager";
import { KnitServer } from "@rbxts/knit";
import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig";
import { Pet } from "./game/Pet";


KnitServer.AddServices(script.Parent!.FindFirstChild('services') as Folder)
// Component.Auto(script.Parent!.FindFirstChild("components") as Folder)

KnitServer.Start()
    .andThen(() =>
    {
        print("Server Start")

        let monsterManager = MonsterManager.GetInstance();
        monsterManager.Init()

        RunService.Heartbeat.Connect(dt =>
        {
            monsterManager.Update(dt);
        })

        Players.PlayerRemoving.Connect(player =>
        {
            GameDataManager.GetInstance().GetPlayerDataAccessor(player).ResetData();
        })


        //test
        let pet = new Pet()

        RunService.Heartbeat.Connect(dt =>
        {
            pet.Update(dt)
        })
    })
    .catch(warn)