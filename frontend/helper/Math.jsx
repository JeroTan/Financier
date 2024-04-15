export function randomizer(min = 0, max = Number.MAX_SAFE_INTEGER, allowDecimal = false){
    const randData = Math.random();
    const result = randData * (max-min) + min;

    if(result % 1 == 0)
        return result;

    if(allowDecimal){
        return adjustDecimal(result, allowDecimal);
    }else{
        return removeDecimal(result);
    }

}

export function removeDecimal(number){
    let result = Math.floor(number);
    result = String(result);
    if(result.includes('.')){
        result = result.split(".");
        result = result[0];
    }
    result = Number(result);
    return result;
}
export function ceilDecimal(number){
    return removeDecimal( Math.ceil(number) );
}

export function adjustDecimal(number, addPlaceValue = true){
    const placeValue = typeof addPlaceValue === "boolean" ? 2 : Number(addPlaceValue);
    let result = number.toFixed(placeValue);
    if(placeValue < result.split(".")[1].length){
        result = result.split(".");
        result = `${result[0]}.${result[1].slice(placeValue)}`;
        result = Number(result);
    }
    return result;
}

export function separateNumber(raw){
    const result = {
        sign: false, //Sign Boolean
        whole: 0,
        decimal: 0,
    }
    const splitRaw = raw.toString().split(".");
    if(splitRaw[0][0] == "-" ){
        result.sign = true;
        result.whole = Number(splitRaw[0].substring(1));
    }else{
        result.whole = Number(splitRaw[0]);
    }

    if(splitRaw.length == 2)
        result.decimal = Number(splitRaw[1]);

    return result;
}

export function combineNumber(data, convertToNumber = false){
    let result = `${data.sign ? "-":""}${data.whole}${ data.decimal ? "."+data.decimal : "" }`;
    if(convertToNumber)
        result = Number(result);
    return result;
}

export function padNumber(number, length){
    const raw = separateNumber(number);
    if(length < 0)
        length = 0;
    const paddingValue = 10 ** length;
    
    if(paddingValue > raw.whole){
        raw.whole = (paddingValue + raw.whole).toString().substring(1);
        return combineNumber(raw, false);
    }

    return combineNumber(raw, false);
    
}


//Date Transformer
export function transformDate(date, format="simple"){
    const dateMe = new Date(date);
    switch(format){
        case "simple":{
            return `${dateMe.getFullYear()}, ${dateMe.getMonth()}-${dateMe.getDate()} | ${dateMe.getHours()}:${dateMe.getMinutes()}`;
        }
        case "yyyy-mm-dd":{
            return `${padNumber(dateMe.getFullYear(), 4)}-${padNumber(date.getMonth()+1, 2)}-${padNumber(date.getDate(), 2)}`;
        }
    }
   
}
export function getToday(){
    return transformDate(Date.now());
}
export function toISODateFormat(date, standard = false){
    if(standard)
        return data.toISOString();

    return `${date.getFullYear()}-${padNumber(date.getMonth()+1, 2)}-${padNumber(date.getDate(), 2)}T${padNumber(date.getHours(), 2)}:${padNumber(date.getMinutes(), 2)}`
}

export function numberOfDays(month, year = new Date().getFullYear(), date =false){
    if(typeof month == "string" && isNaN(month)){
        month = month.toLowerCase();
    }else{
        month = month.toString();
    }
    if(typeof year == "string"){
        year = Number(year);
    }
    if(date){
        month = (date.getMonth()+1).toString();
        year = date.getFullYear();
    }

    switch(month){
        case "1":
        case "january":
            return 31;
        case "2":
        case "february":
            return year % 4 === 0 ? 29: 28;
        case "3":
        case "march":
            return 31;
        case "4":
        case "april":
            return 30;
        case "5":
        case "may":
            return 31;
        case "6":
        case "june":
            return 30;
        case "7":
        case "july":
            return 31;
        case "8":
        case "august":
            return 31;
        case "9":
        case "september":
            return 30;
        case "10":
        case "october":
            return 31;
        case "11":
        case "november":
            return 30;
        case "12":
        case "december":
            return 31;
    }
}
//Please make a date class for time so that it is not convuluted
export class TimeChanger{
    constructor(date = false){
        if(date){
            this.date = new Date(date);
        }else{
            this.date = new Date();
        }
        const second = 1000; //1000 milliseconds == 1 second;
        const minute = 60 * second; 
        const hour = 60 * minute;
        const day = 24 * hour;
        this.reference = {
            second: second,
            minute: minute,
            hour: hour,
            day: day,
        }
    }
    normalize(whatTime, type="min"){//@whatTime = Year(2037 or 1970), Month(0 or 11), Day(0, 28,29,30,31), Hour(0, 23), Minute(0, 59), Seconds(0, 59), Milliseconds(0,999)
        const {second} = this.reference;
        const translate = {
            "0":0, "millisecond":0, "Millisecond":0, "ms":0,    "MS":0,      "mls":0,   "MIS":0,
            "1":1, "second":1,      "Second":1,      "s":1,     "S":1,       "ss":1,    "SS":1,
            "2":2, "minute":2,      "Minute":2,      "m":2,     "M":2,       "mi":2,    "MI":2,
            "3":3, "hour":3,        "Hour":3,        "h":3,     "H":3,       "hh":3,    "HH":3,
            "4":4, "day":4,         "Day":4,         "date":4,  "Date":4,    "d":4,     "D":4,      "dd":4,    "DD":4,
            "5":5, "month":5,       "Month":5,       "mm":5,    "MM":5,
            "6":6, "year":6,        "Year":6,        "y":6,     "y":6,       "yyyy":6,  "YYYY":7,
        }
        if(translate[whatTime]){
            return this;
        }
        switch(translate[whatTime]){
            case 6: case 5: case 4: case 3: case 2: case 1: case 0:
                this.date.setMilliseconds( type=="min"?0:999 );
            break;
            case 6: case 5: case 4: case 3: case 2: case 1:
                this.date.setSeconds( type=="min"?0:59 );
            break;
            case 6: case 5: case 4: case 3: case 2:
                this.date.setMinutes( type=="min"?0:59 );
            break;
            case 6: case 5: case 4: case 3:
                this.date.setHours( type=="min"?0:23 );
            break;
            case 6: case 5: case 4:
                if(type=="min"){
                    this.date.setDate(1);
                }
                else{
                    this.date.setDate(32);
                    this.date.setDate(0);
                }
            break;
            case 6: case 5:
                this.date.setMonth( type=="min"?0:11 );
            break;
            case 6:
                this.date.setFullYear( type=="min"?1970:2037 );
            break;
        }
        return this;
    }

    prevSecond(n=1){
        const {second} = this.reference;
        this.date.setTime( -(second*n) );
        return this;
    }
    prevMinute(n=1){
        const {minute} = this.reference;
        this.date.setTime( -(minute*n) );
        return this;
    }
    prevHour(n=1){
        const {hour} = this.reference;
        this.date.setTime( -(hour*n) );
        return this;
    }
    prevDay(n =1){
        const {day} = this.reference;
        this.date.setTime( -(day*n) );
        return this;
    }
    prevWeek(n=1){
        const {day} = this.reference;
        this.date.setTime( -(day*7*n) );
        return this;
    }
    prevMonth(n=1, type="min"){
        while(n>0){
            this.date.setDate(0);
            --n;
        }
        if(type=="min")
                this.date.setDate(1);
        return this;
    }
    prevYear(n=1){
        this.date.setFullYear( this.date.getFullYear()-n );
        return this;
    }
    prevDecade(n=1){
        this.date.setFullYear( this.date.getFullYear()-n*10 );
        return this;
    }
    prevCentury(n=1){
        this.date.setFullYear( this.date.getFullYear()-n*100 );
        return this;
    }
    nextSecond(n=1){
        const {second} = this.reference;
        this.date.setTime( second*n );
        return this;
    }
    nextMinute(n=1){
        const {minute} = this.reference;
        this.date.setTime( minute*n );
        return this;
    }
    prevHour(n=1){
        const {hour} = this.reference;
        this.date.setTime( hour*n );
        return this;
    }
    nextDay(n =1){
        const {day} = this.reference;
        this.date.setTime( day*n );
        return this;
    }
    nextWeek(n=1){
        const {day} = this.reference;
        this.date.setTime( day*7*n );
        return this;
    }
    nextMonth(n=1, type="min"){
        while(n>0){
            this.date.setDate(32);
            this.date.setDate(1);
            --n;
        }
        if(type=="max"){
            this.date.setDate(32);
            this.date.setDate(0);
        }
            
        return this;
    }
    nextYear(n=1){
        this.date.setFullYear( this.date.getFullYear()+n );
        return this;
    }
    nextDecade(n=1){
        this.date.setFullYear( this.date.getFullYear()+n*10 );
        return this;
    }
    nextCentury(n=1){
        this.date.setFullYear( this.date.getFullYear()+n*100 );
        return this;
    }
    
    getDate(){
        return this.date;
    }
}