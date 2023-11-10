import { KnitServer as Knit, RemoteProperty, RemoteSignal } from "@rbxts/knit";

declare global
{
    interface KnitServices
    {
        PlayerDataService: typeof PlayerDataService;
    }
}

const PlayerDataService = Knit.CreateService({
    Name: "PlayerDataService",

    Client:
    {
        AttackValue: new RemoteProperty(10),
        GoldValue: new RemoteProperty(0),

        AddAttackValue: new RemoteSignal<() => void>(),
        AddGoldValue: new RemoteSignal<() => void>(),
    },

    KnitInit()
    {
        //客户端请求增加攻击力
        this.Client.AddAttackValue.Connect(() =>
        {
            const curAttackValue = this.Client.AttackValue.Get();
            const increaseValue = curAttackValue / 5;
            this.Client.AttackValue.Set(curAttackValue + increaseValue);
        });
    },

    KnitStart()
    {

    },
});

export = PlayerDataService;