export type WeaponConfig = {
    id: string,
    assetId: number,
    name: string,
    strength: number,
    quality: "Normal" | "Rare"
    price: number
}

export class WeaponConfigCollection
{
    private static _configs: WeaponConfig[] = [
        {
            id: "测试武器1",
            name: "测试武器1",
            strength: 10,
            quality: "Normal",
            price: 100,
            assetId: 0,
        },
        {
            id: "测试武器2",
            name: "测试武器2",
            strength: 100,
            quality: "Rare",
            price: 200,
            assetId: 0,
        }
    ]

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