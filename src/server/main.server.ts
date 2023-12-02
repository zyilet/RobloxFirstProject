/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-01 13:47:40
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-12-02 10:48:52
 * @FilePath: \RobloxFirstProject\src\server\main.server.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Players, RunService, StarterGui } from "@rbxts/services";
import { MonsterManager } from "./game/Monster/MonsterManager";
import { GameDataManager } from "./game/DataStore/GameDataManager";
import { KnitServer } from "@rbxts/knit";
import { PetManager } from "./game/Pet/PetManager";
import { AssetCacheManager } from "shared/AssetCache/AssetCacheManager";
import { IdleState, RunState, TestOwner, TestStateKeys } from "shared/FSM/FsmStateBase";
import { Fsm } from "shared/FSM/Fsm";
import { Change, Event } from "@rbxts/roact";

Players.CharacterAutoLoads = false;

KnitServer.AddServices(script.Parent!.FindFirstChild('services') as Folder)
// Component.Auto(script.Parent!.FindFirstChild("components") as Folder)

KnitServer.Start()
    .andThen(() =>
    {
        print("Server Start")

        let monsterManager = MonsterManager.GetInstance()
        let petManager = PetManager.GetInstance()
        let assetCacheManager = AssetCacheManager.GetInstance()

        monsterManager.Init()
        petManager.Init()
        assetCacheManager.Init()

        RunService.Heartbeat.Connect(dt =>
        {
            monsterManager.Update(dt);
            petManager.Update(dt)
            assetCacheManager.Update(dt)
        })

        Players.PlayerRemoving.Connect(player =>
        {
            GameDataManager.GetInstance().GetPlayerDataAccessor(player).ResetData();
        })

        //test
        // let testOwner = new TestOwner()
        // let testFsm = new Fsm<TestOwner, TestStateKeys>()
        // testFsm.AddState(new IdleState(testOwner, testFsm))
        // testFsm.AddState(new RunState(testOwner, testFsm))
        // testFsm.Start("IdleState")

        // RunService.Heartbeat.Connect(dt =>
        // {
        //     testFsm.Update(dt)
        // })

        Players.PlayerAdded.Connect(p =>
        {
            let folder = new Instance("Folder")
            folder.Name = "Cache"
            folder.Parent = p

            wait(5)
            KnitServer.GetService("WeaponService").AddWeapon(p, "测试武器1")
            KnitServer.GetService("WeaponService").AddWeapon(p, "测试武器1")
            KnitServer.GetService("WeaponService").AddWeapon(p, "测试武器2")
            KnitServer.GetService("WeaponService").AddWeapon(p, "测试武器2")
            KnitServer.GetService("WeaponService").AddWeapon(p, "测试武器2")
            KnitServer.GetService("WeaponService").AddWeapon(p, "测试武器1")
            KnitServer.GetService("WeaponService").AddWeapon(p, "测试武器2")
        })
    })
    .catch(warn)