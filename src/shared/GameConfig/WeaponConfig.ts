export type WeaponConfig = {
    Id: string,
    AssetId: number,
    Name: string,
    Strength: number,
    Quality: "Normal" | "Rare"
    Price: number
}

let config: WeaponConfig[] = [
    {
        Id: "测试武器1",
        Name: "测试武器1",
        Strength: 10,
        Quality: "Normal",
        Price: 100,
        AssetId: 15493679873,
    },
    {
        Id: "测试武器2",
        Name: "测试武器2",
        Strength: 100,
        Quality: "Rare",
        Price: 200,
        AssetId: 15493696236,
    }
]

export class WeaponConfigCollection
{
    private static _configs = config

    public static GetAllConfig()
    {
        return this._configs
    }

    public static GetConfigById(id: string)
    {
        let config = this._configs.filter(config => config.Id === id).pop();
        return config ? config : error("没有和传入id相匹配的配置数据")
    }
}