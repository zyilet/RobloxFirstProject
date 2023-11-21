export type PetConfig = {
    id: string,
    assetId: number,
    name: string,
    ratio: number,
}

let config: PetConfig[] = [
    {
        id: "测试宠物1",
        name: "测试宠物1",
        assetId: 15410481875,
        ratio: 2
    }
]

export class PetConfigCollection
{
    private static _configs = config

    public static GetAllConfig()
    {
        return this._configs
    }

    public static GetConfigById(id: string)
    {
        let config = this._configs.filter(config => config.id === id).pop();
        return config ? config : error("没有和传入id相匹配的配置数据")
    }
}