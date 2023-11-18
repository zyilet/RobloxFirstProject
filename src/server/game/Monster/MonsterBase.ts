/**
 * @description: 可被攻击对象抽象父类
 * @return {*}
 */
export abstract class MonsterBase
{
    public Id: string = ""
    protected MaxHP: number = 0;
    protected CurHP: number = 0;

    public abstract OnDamaged(damage: number): void;
    public abstract OnDead(): void;

    public abstract GetCurHp(): number;
}
