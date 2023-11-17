import { HttpService } from "@rbxts/services";

export class WeaponData
{
    public AssetId: number;
    public WeaponId: string;
    public Strength: number;
    public Quality: WeaponQuality;
    public Price: number;

    constructor(assetId: number, strength: number, quality: WeaponQuality, price: number)
    {
        this.AssetId = assetId;
        this.WeaponId = HttpService.GenerateGUID(false);
        this.Strength = strength
        this.Quality = quality
        this.Price = price
    }
}

export type WeaponQuality = "Normal" | "Rare"