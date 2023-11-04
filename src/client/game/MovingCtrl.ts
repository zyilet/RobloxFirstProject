/*
 * @Author: zyilet zhaoyims@outlook.com
 * @Date: 2023-11-04 15:11:12
 * @LastEditors: zyilet zhaoyims@outlook.com
 * @LastEditTime: 2023-11-04 16:58:11
 * @FilePath: \RobloxFirstProject\src\client\game\MovingCtrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { ContextActionService, RunService } from "@rbxts/services"
import { MeterToStud } from "shared/Constants";
import GameObjLoader from "./GameObjLoader";
import { Transform } from "shared/Transform";

export default class MovingCtrl {

    private _isPress = {
        W: false,
        S: false,
        A: false,
        D: false,
    }
    private _speed = MeterToStud(1);
    private _humanoidRoot = GameObjLoader.GetInstance().GetHumanoidRoot() as Part;

    public Init() {
        this.SubscribeInput();
        this.UpdateMove();
    }

    private SubscribeInput() {
        ContextActionService.BindAction(
            "MoveInput",
            (name, state, input) => {
                if (state === Enum.UserInputState.Begin) {
                    switch (input.KeyCode) {
                        case Enum.KeyCode.W:
                            this._isPress.W = true;
                            break;
                        case Enum.KeyCode.S:
                            this._isPress.S = true;
                            break;
                        case Enum.KeyCode.A:
                            this._isPress.A = true;
                            break;
                        case Enum.KeyCode.A:
                            this._isPress.A = true;
                            break;
                    }
                }
                else {
                    switch (input.KeyCode) {
                        case Enum.KeyCode.W:
                            this._isPress.W = false;
                            break;
                        case Enum.KeyCode.S:
                            this._isPress.S = false;
                            break;
                        case Enum.KeyCode.A:
                            this._isPress.A = false;
                            break;
                        case Enum.KeyCode.A:
                            this._isPress.A = false;
                            break;
                    }
                }

                return Enum.ContextActionResult.Sink;
            },
            false,
            Enum.KeyCode.W,
            Enum.KeyCode.S,
            Enum.KeyCode.A,
            Enum.KeyCode.D,)
    }

    private UpdateMove() {
        RunService.Heartbeat.Connect(dt => {
            let dir = new Vector3();
            if (this._isPress.W) {
                dir.add(new Vector3(0, 0, -1));
            }
            if (this._isPress.S) {
                dir.add(new Vector3(0, 0, 1));
            }
            if (this._isPress.A) {
                dir.add(new Vector3(-1, 0, 0));
            }
            if (this._isPress.D) {
                dir.add(new Vector3(1, 0, 0));
            }
            dir = dir.Unit;
        })
    }
}