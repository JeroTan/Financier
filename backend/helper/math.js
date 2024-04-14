export function transformDate(date){
    const dateMe = new Date(date);
    return `${dateMe.getFullYear()}, ${dateMe.getMonth()} ${dateMe.getDate()} | ${dateMe.getHours()}:${dateMe.getMinutes()}:${dateMe.getSeconds()}`;
}

export function getToday(){
    return transformDate(Date.now());
}

export function toISODateFormat(date, standard = false){
    if(standard)
        return data.toISOString();
        return `${date.getFullYear()}-${padNumber(date.getMonth()+1, 2)}-${padNumber(date.getDate(), 2)}T${padNumber(date.getHours(), 2)}:${padNumber(date.getMinutes(), 2)}`
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