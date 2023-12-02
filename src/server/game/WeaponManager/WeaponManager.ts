import { WeaponConfigCollection } from "shared/GameConfig/WeaponConfig"
import { GameDataManager } from "../DataStore/GameDataManager"

export class WeaponManger
{
    private static instance: WeaponManger
    public static GetInstance()
    {
        return this.instance ??= new WeaponManger()
    }

    private equipTasks: [player: Player, { (): void }][] = []
    private equipTools: [player: Player, tool: Tool][] = []

    //创建对某一个玩家进行武器相关操作的对象
    public CreateAccessor(player: Player)
    {
        return {
            EquipWeapon: (guid: string) => this.EquipWeapon(player, guid),
            UnEquipWeapon: () => this.UnEquipWeapon(player),
            AddWeapon: (weaponId: string) => this.AddWeapon(player, weaponId),
            RemoveWeapon: (guid: string) => this.RemoveWeapon(player, guid),
            GetAllWeapon: () => this.GetAllWeapon(player),
            GetWeapon: (guid: string) => this.GetWeapon(player, guid),
            GetEquippedWeapon: () => this.GetEquippedWeapon(player),
        }
    }

    //装备武器
    public EquipWeapon(player: Player, guid: string)
    {
        let accessor = this.GetAccessor(player)
        if (accessor.GetAllWeapon().find(weapon => weapon.Guid === guid))
        {
            accessor.EquipWeapon(guid)

            //显示武器模型
            task.spawn(() =>
            {
                let lastTask = this.equipTasks.remove(this.equipTasks.findIndex(ele => ele[0].UserId === player.UserId))
                if (lastTask)
                {
                    lastTask[1]()
                }
                let lastTool = this.equipTools.remove(this.equipTools.findIndex(ele => ele[0].UserId === player.UserId))
                if (lastTool)
                {
                    lastTool[1].Destroy()
                }

                let canRunning = true
                this.equipTasks.push([player, () => canRunning = false])
                while (canRunning && wait())
                {
                    let toolAssetId = WeaponConfigCollection.GetConfigById(this.GetWeapon(player, guid).Id).assetId
                    let char = player.Character
                    let tool = player.FindFirstChild("Cache")?.FindFirstChild(tostring(toolAssetId))?.Clone() as Tool

                    if (char && tool)
                    {
                        tool.Parent = char

                        this.equipTasks.remove(this.equipTasks.findIndex(ele => ele[0].UserId === player.UserId))
                        this.equipTools.push([player, tool])
                        break
                    }
                }
            })
        }
        else
        {
            error(`玩家 ${player.Name} 拥有的武器中找不到guid为 ${guid} 的武器`)
        }
    }

    //取消装备
    public UnEquipWeapon(player: Player)
    {
        this.GetAccessor(player)
            .EquipWeapon(undefined)
    }

    //增加武器
    public AddWeapon(player: Player, weaponId: string)
    {
        if (WeaponConfigCollection.GetAllConfig().find(config => config.id === weaponId))
        {
            let weapon = this.GetAccessor(player).AddWeapon(weaponId)
            return weapon
        }
        error(`武器配置文件中找不到这个id ${weaponId}`)
    }

    //删除武器
    public RemoveWeapon(player: Player, guid: string)
    {
        let accessor = this.GetAccessor(player)

        if (accessor.GetAllWeapon().find(weapon => weapon.Guid === guid))
        {
            accessor.RemoveWeapon(guid)
        }
        else
        {
            error(`玩家 ${player.Name} 拥有的武器中找不到guid为 ${guid} 的武器`)
        }
    }

    //获取玩家的所有武器
    public GetAllWeapon(player: Player)
    {
        return this.GetAccessor(player).GetAllWeapon()
    }

    //获取指定武器
    public GetWeapon(player: Player, guid: string)
    {
        return this.GetAccessor(player).GetAllWeapon().find(weapon => weapon.Guid === guid)
            ?? error(`玩家 ${player.Name} 拥有的武器中找不到guid为 ${guid} 的武器`)
    }

    //获取当前装备的武器
    public GetEquippedWeapon(player: Player)
    {
        return this.GetAccessor(player).GetCurEquipWeapon()
    }

    private GetAccessor(player: Player)
    {
        return GameDataManager.GetInstance().GetPlayerDataAccessor(player)
    }
}