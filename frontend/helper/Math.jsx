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

export function transformDate(date){
    const dateMe = new Date(date);
    return `${dateMe.getFullYear()}, ${dateMe.getMonth()}-${dateMe.getDate()} | ${dateMe.getHours()}:${dateMe.getMinutes()}`;
}


export function getToday(){
    return transformDate(Date.now());
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
    let result = `${data.sign ?? ""}${data.whole}${ data.decimal ? "."+data.decimal : "" }`;
    if(convertToNumber)
        result = Number(result);
    return result;
}