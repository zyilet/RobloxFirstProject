import { RunService, UserInputService } from "@rbxts/services";

enum InputStatus {
    None,
    Began,
    Hold,
    End,
}

export default class inputHelper {

    private static _instance: inputHelper;
    public static GetInstance() {
        return this._instance ??= new inputHelper();
    }

    private _preKeyStatus = new Map<Enum.UserInputType, InputStatus>();
    private _curKeyStatus = new Map<Enum.UserInputType, InputStatus>();

    constructor() {

        UserInputService.InputBegan.Connect((input, processed) => {
            this._curKeyStatus.set(input.UserInputType, InputStatus.Began);
        });
        UserInputService.InputEnded.Connect((input, processed) => {
            this._curKeyStatus.set(input.UserInputType, InputStatus.End);
        });

        RunService.Heartbeat.Connect(dt => {
            this._preKeyStatus.forEach((v, k) => {
                if (v === InputStatus.Began) {
                    this._curKeyStatus.set(k, InputStatus.Hold);
                }
                if (v === InputStatus.End) {
                    this._curKeyStatus.set(k, InputStatus.None);
                }
            })

            this._preKeyStatus = this._curKeyStatus; 
        });
    }

}