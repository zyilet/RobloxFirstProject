export class WeaponData
{
    public AssetId: number;
    public Strength: number;
    public Quality: WeaponQuality;

    constructor(id: number, strength: number, quality: WeaponQuality)
    {
        this.AssetId = id;
        this.Strength = strength
        this.Quality = quality
    }
}

export type WeaponQuality = "Normal" | "Rare"