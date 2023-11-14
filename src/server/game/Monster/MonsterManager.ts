import { CollectionService, RunService } from "@rbxts/services";
import { MonsterBase } from "./MonsterBase";
import { Monster } from "./Monster";
import { MonsterPositionInfo } from "./RefreshPositionInfo";
import { MonsterConfigCollection } from "./MonsterConfigCollection";
import { KnitServer } from "@rbxts/knit";
/**
 * @description: 可被攻击对象管理器
 * @return {*}
 */
export class MonsterManager
{
    private static _instance: MonsterManager;
    public static GetInstance()
    {
        return this._instance ??= new MonsterManager();
    }


    private _modelToObj = new Map<Model, MonsterBase>()
    private _posInfos = new Array<MonsterPositionInfo>();
    private _modelToPosInfo = new Map<Model, MonsterPositionInfo>();

    public Init()
    {
        let positions = CollectionService.GetTagged("AttackableObjectSpawnPosition");
        positions.forEach(pos =>
        {
            let posPart = pos as Part;
            let id = (pos.WaitForChild("RefreshID") as StringValue).Value;
            let posInfo = new MonsterPositionInfo();
            posInfo.monsterID = id;
            posInfo.cFrame = posPart.CFrame;
            this._posInfos.push(posInfo)
        })
    }

    public Update(dt: number)
    {
        for (let i = 0; i < this._posInfos.size(); i++)
        {
            const posInfo = this._posInfos[i];
            const refreshDuration = 3;
            const elapse = os.time() - posInfo.deadTime

            if (posInfo.posState === "Empty" && elapse > refreshDuration)
            {
                posInfo.posState = "Loading"
                task.defer(() =>
                {
                    let monster = new Monster();
                    let model = monster.Init(MonsterConfigCollection.GetConfigForId(posInfo.monsterID), posInfo.cFrame)
                    if (!model)
                    {
                        posInfo.posState = "Empty"
                        return;
                    }
                    posInfo.posState = "Exist"
                    posInfo.monsterRef = monster
                    posInfo.refreshTime = os.time()

                    this._modelToPosInfo.set(model, posInfo);
                })
            }
        }
    }

    public TakeDamage(model: Model, player: Player)
    {
        let posInfo = this._modelToPosInfo.get(model)!
        let monster = posInfo.monsterRef!;
        let damage = KnitServer.GetService("PlayerDataService").GetAttack(player);

        monster.OnDamaged(damage)

        if (monster.GetCurHp() <= 0)
        {
            posInfo.deadTime = os.time();
            posInfo.posState = "Empty"
            posInfo.monsterRef = undefined;
            this._modelToObj.delete(model);
            monster.OnDead()
        }
    }
}