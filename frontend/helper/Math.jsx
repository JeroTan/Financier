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

export function adjustDecimal(number, condition = true){
    const placeValue = typeof condition === "boolean" ? 2 : Number(condition);
    let result = placeValue.toFixed(placeValue);
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