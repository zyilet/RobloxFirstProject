export type MonsterConfig = {
    id: string,
    name: string,
    hp: number,
    assetID: number,
    reward: WeightedReward[],
}

export type WeightedReward = {
    weight: number,
    gold?: number[],
    weaponId?: string
}

export type Reward = { type: "Gold", value: number } | { type: "Weapon", id: string }

export class MonsterConfigCollection
{
    private static _configs: MonsterConfig[] = [
        {
            id: "测试怪物1",
            name: "测试怪物1",
            hp: 1000,
            assetID: 15296980369,
            reward: [
                {
                    weight: 10,
                    weaponId: "测试武器1"
                },
                {
                    weight: 20,
                    gold: [1, 10],
                },
                {
                    weight: 5,
                    weaponId: "测试武器2"
                }
            ]
        }, {
            id: "测试怪物2",
            name: "测试怪物2",
            hp: 10000,
            assetID: 15296980369,
            reward: [
                {
                    weight: 40,
                    gold: [100, 200],
                }
            ]
        }
    ]

    public static GetAllConfig()
    {
        return this._configs;
    }

    public static GetConfigById(id: string)
    {
        let config = this._configs.filter(config => config.id === id).pop();
        return config ? config : error("没有和传入id相匹配的配置数据")
    }

    public static GetRandomReward(id: string): Reward | undefined
    {
        let config = this.GetConfigById(id);
        let rewards = config.reward;

        let roll = math.random(100)
        let result: WeightedReward | undefined = undefined
        for (let i = 0; i < rewards.size(); i++)
        {
            const reward = rewards[i];
            roll -= reward.weight;
            if (roll <= 0)
            {
                result = reward
                break
            }
        }
        if (!result)
        {
            return undefined
        }

        if (result.weaponId)
        {
            return { type: "Weapon", id: result.weaponId };
        }

        if (result.gold)
        {
            return { type: "Gold", value: math.random(result.gold[0], result.gold[1]) }
        }
    }
}