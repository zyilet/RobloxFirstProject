export default class NumberFormatter
{
    private static _units = ["K", "M", "G", "T", "P", "E", "Z", "Y", "R", "Q"]
    private static _unitLength = 3;
    private static _precisionLength = 1;

    public static Format(number: number, precision: number = 1)
    {
        let numberStr = tostring(number)

        if (number < 1000)
        {
            return this.SimpleNumberFormat(numberStr)
        }
        else if (numberStr.find("+")[0])
        {
            return this.ScientificFormat(numberStr);
        }
        else
        {
            return this.NumberFormat(numberStr);
        }
    }

    /**
     * @description: 小于1000的数直接返回一个精度
     * @return {*}
     */
    private static SimpleNumberFormat(number: string)
    {
        let dotIndex = number.find("%.")[0];
        if (dotIndex)
        {
            return number.sub(1, dotIndex + 1);
        }
        else
        {
            return number + ".0"
        }
    }

    private static NumberFormat(number: string)
    {
        //清除小数位
        {
            let dotIndex = number.find("%.")[0];
            if (dotIndex)
            {
                number = number.sub(1, dotIndex - 1);
            }
        }
        //数字字符串长度
        let numberLength = number.size();
        //余数
        let remainder = numberLength % this._unitLength;
        //商
        let divisionResult = math.floor(numberLength / this._unitLength)
        if (remainder === 0 && divisionResult !== 0)
            divisionResult -= 1;
        //如果不足1000，就返回原始数字
        if (divisionResult === 0)
        {
            return number;
        }
        let result = ""
        //显示的整数数字
        let showLength = remainder === 0 ? this._unitLength : remainder;
        result = number.sub(1, showLength);
        //显示的小数数字
        let showPrecision = number.sub(showLength + 1, showLength + this._precisionLength)
        result += "." + showPrecision
        result += this._units[divisionResult - 1];
        return result
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
            let dotIndex = number.find("%.")[0]
            if (dotIndex)
            {
                number = number.sub(1, dotIndex + 1);
            }
            return number + `×10^${index}`
        }

        number = number.gsub("%.", "")[0];
        number = number.sub(0, number.find("e")[0]! - 1);
        let result = ""
        //if number == 9.876e32 then rightOffset == 2
        let rightOffset = index - unitIndex * this._unitLength;
        //整数部分
        result = number.sub(1, 1 + rightOffset)
        //小数部分
        let t = number.sub(rightOffset + 2, rightOffset + 2)
        if (t !== "")
        {
            result += "." + t
        }
        //单位
        result += this._units[unitIndex - 1];

        print(result)
        return result;
    }
}