import { GameDataManager } from "../DataStore/GameDataManager"

export class PlayerDataManager
{
    private static instance: PlayerDataManager
    public static GetInstance()
    {
        return this.instance ??= new PlayerDataManager()
    }


    public CreateAccessor(player: Player)
    {
        return {
            AddGold: (value: number) => this.AddGold(player, value),
            RemoveGold: (value: number) => this.RemoveGold(player, value),
            AddAttackValue: (value: number) => this.AddAttackValue(player, value),
            GetGold: () => this.GetGold(player),
            GetAttackValue: (player: Player) => this.GetAttackValue(player)
        }
    }

    public AddGold(player: Player, value: number)
    {
        this.GetAccessor(player)
            .AddGold(value)
    }

    public RemoveGold(player: Player, value: number)
    {
        this.GetAccessor(player)
            .RemoveGold(value)
    }

    public AddAttackValue(player: Player, value: number)
    {
        this.GetAccessor(player)
            .AddAttack(value)
    }

    public GetGold(player: Player)
    {
        return this.GetAccessor(player).GetGold()
    }

    public GetAttackValue(player: Player)
    {
        return this.GetAccessor(player).GetAttack()
    }

    private GetAccessor(player: Player)
    {
        return GameDataManager.GetInstance().GetPlayerDataAccessor(player)
    }
}