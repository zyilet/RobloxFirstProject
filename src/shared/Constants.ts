/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-02 17:37:16
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-08 13:54:48
 * @FilePath: \RobloxFirstProject\src\shared\Constants.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Players, Workspace } from "@rbxts/services";

export const Tags = {
    Attackable: "Attackable"
}

//1000米
export const OneKM = 100 / 28 * 1000;
//1米 == 28 stud
export const OneMeter = 100 / 28;

export function MeterToStud(meter: number)
{
    return meter * OneMeter;
}

export function AngleToRad(angle: number)
{
    return math.rad(angle);
}

export function WaitCharacter()
{
    let character = Players.LocalPlayer.Character;
    while (!character)
    {
        wait();
        character = Players.LocalPlayer.Character;
    }
    return character;
}

export function WaitCurrentCamera()
{
    let camera = Workspace.CurrentCamera;
    while (!camera)
    {
        wait();
        camera = Workspace.CurrentCamera;
    }
    return camera;
}

export function WaitHumanoid()
{
    let character = WaitCharacter();
    return character.WaitForChild("Humanoid") as Humanoid;
}

export function WaitHumanoidRoot()
{
    let character = WaitCharacter();
    return character.WaitForChild("HumanoidRootPart") as Part;
}

export function WaitHumanoidRootAttachment()
{
    let root = WaitHumanoidRoot();
    return root.WaitForChild("RootAttachment") as Attachment;
}

export function ToAssetId(id: string)
{
    return `rbxassetid://${id}`
}