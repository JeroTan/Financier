export function transformDate(date){
    const dateMe = new Date(date);
    return `${dateMe.getFullYear()}, ${dateMe.getMonth()} ${dateMe.getDate()} | ${dateMe.getHours()}:${dateMe.getMinutes()}:${dateMe.getSeconds()}`;
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