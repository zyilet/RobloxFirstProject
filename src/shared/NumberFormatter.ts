export default class NumberFormatter
{
    private static _units = ["K", "M", "G", "T", "P", "E", "Z", "Y", "R", "Q"]
    private static _unitLength = 3;
    private static _precisionLength = 1;

    public static Format(number: number, precision: number = 1)
    {
        number = 1.33e32;

        let numberStr = tostring(number)
        let result = numberStr.find("+")[0] ? this.ScientificFormat(numberStr) : this.NumberFormat(numberStr);

        // // 1,000 => 1k 1,100 => 1.1k
        // // 1,000,000 => 1M
        // let result = "";
        // //数字字符串
        // let numberStr = string.format("%f", number)
        // //数字字符串长度
        // let numberLength = numberStr.size();
        // //余数
        // let remainder = numberLength % this._unitLength;
        // //商
        // let divisionResult = math.floor(numberLength / this._unitLength)
        // print(numberLength / this._unitLength)
        // if (remainder === 0 && divisionResult !== 0)
        //     divisionResult -= 1;
        // //如果不足1000，就返回原始数字
        // if (divisionResult === 0)
        // {
        //     return numberStr;
        // }
        // //显示的整数数字
        // let showLength = remainder === 0 ? this._unitLength : remainder;
        // result = numberStr.sub(1, showLength);
        // //显示的小数数字
        // let showPrecision = numberStr.sub(showLength + 1, showLength + this._precisionLength)
        // result += "." + showPrecision

        // //如果单位超过最大预设单位，返回科学计数法
        // if (divisionResult >= this._units.size())
        // {
        //     result += "E" + divisionResult * this._unitLength;
        // }
        // else
        // {
        //     result += this._units[divisionResult];
        // }

        // print(divisionResult, this._units[divisionResult])

        // return result;
    }

    private static NumberFormat(number: string)
    {
        print(number)
    }

    private static ScientificFormat(number: string)
    {
        let start = number.find("+")[0]
        //if number == 9.876e32 then index == 32
        let index = tonumber(number.sub(start! + 1))!
        // if number == 9.876e32 then unitIndex == floor(32/3) == 10 
        let unitIndex = math.floor(index / this._unitLength)
        //如果超出了预定义的单位最大范围，就显示科学计数法
        if (unitIndex > this._units.size())
        {
            print(number)
            return number;
        }

        number = number.gsub(".", "")[0]

        let result = ""
        //if number == 9.876e32 then rightOffset == 2
        let rightOffset = index - unitIndex * this._unitLength;


        print(number)
        print(number.sub(start! + 1))
    }
}