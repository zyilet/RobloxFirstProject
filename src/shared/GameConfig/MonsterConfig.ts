export type MonsterConfig = {
    id: string,
    name: string,
    hp: number,
    assetID: number,
}

export class MonsterConfigCollection
{
    private static _configs: MonsterConfig[] = [
        {
            id: "测试怪物1",
            name: "测试怪物1",
            hp: 1000,
            assetID: 15296980369,
        }, {
            id: "测试怪物2",
            name: "测试怪物2",
            hp: 10000,
            assetID: 15296980369
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
}