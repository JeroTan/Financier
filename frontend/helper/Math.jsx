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

export function numberOfDays(month, year = new Date().getFullYear()){
    if(typeof month == "string" && isNaN(month)){
        month = month.toLowerCase();
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

export function numberOfDaysOnDate(date){//accepts date only
    const newDate = new Date( date );
    
    return numberOfDays(newDate.getMonth()+1, newDate.getFullYear() );
}

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
    }
    prevSecond(n=1){

    }
    prevMinute(n=1){

    }
    prevHour(n=1){

    }
    prevDay(n =1){

    }
    prevWeek(n=1){

    }
    prevMonth(n=1){

    }
    prevYear(n=1){

    }
    nextSecond(n=1){

    }
    nextMinute(n=1){

    }
    prevHour(n=1){

    }
    nextDay(n =1){

    }
    nextWeek(n=1){

    }
    nextMonth(n=1){

    }
    nextYear(n=1){

    }
    
    getDate(){
        return this.date;
    }
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

