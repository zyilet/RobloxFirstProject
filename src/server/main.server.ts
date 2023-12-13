import { InsertService, Players, ReplicatedStorage, RunService, StarterGui, Workspace } from "@rbxts/services";
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


Players.PlayerAdded.Connect(p =>
{
    print("添加武器")
    let id = ["测试武器1", "测试武器2"]

    wait(5)

    for (let i = 0; i < 10; i++)
    {
        KnitServer.GetService("WeaponService").AddWeapon(p, id[i % 2])
    }
})

KnitServer.Start()
    .andThen(() =>
    {
        //加载场景 15621801322
        let [s, r] = pcall(() => InsertService.LoadAsset(15621801322))
        if (s)
        {
            let env = (r as Model).GetChildren().pop()!
            env.Parent = Workspace
        }

        //加载UI
        [s, r] = pcall(() => InsertService.LoadAsset(15621866202))
        if (s)
        {
            let env = (r as Model).GetChildren().pop()!
            env.Parent = ReplicatedStorage
        }

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

        KnitServer.GetService("InitializeService").TempFlag = true
    })
    .catch(warn)