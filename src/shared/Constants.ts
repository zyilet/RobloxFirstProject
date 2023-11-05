/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-02 17:37:16
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-02 17:37:45
 * @FilePath: \RobloxFirstProject\src\shared\Constants.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

//1000米
export const OneKM = 100 / 28 * 1000;
//1米 == 28 stud
export const OneMeter = 100 / 28;

export function MeterToStud(meter: number) {
    return meter * OneMeter;
}

export function AngleToRad(angle: number) {
    return math.rad(angle);
}