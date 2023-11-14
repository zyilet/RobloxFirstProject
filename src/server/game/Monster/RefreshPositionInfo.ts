import { MonsterBase } from "./MonsterBase";

export class MonsterPositionInfo
{
    private _haveRefreshed: boolean = false;

    public posState:"Empty"|"Loading"|"Exist" = "Empty"
    public monsterRef: MonsterBase | undefined
    public monsterID: string = ""
    public cFrame: CFrame = new CFrame(Vector3.zero)
    public deadTime: number = 0
    public refreshTime: number = 0
}