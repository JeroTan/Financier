export function anyToArr(input, strSplitter = ","){
    try{
        if( !(typeof input === "string" || Array.isArray(input) || typeof input === "number" || typeof input === "boolean" || input instanceof RegExp) ){
            throw new Error;
        }
    }catch(e){
        console.error("Input is neither Array, String, Number or Regex on strArrToArr helper function.");
        return [];
    }
    let arrayResult = [];
    if(Array.isArray(input)){
        arrayResult = input;
    }else if(typeof input === "string"){
        arrayResult = input.split(strSplitter);
    }else if(input instanceof RegExp || typeof input === "boolean" || typeof input === "number"){
        arrayResult = [input];
    }
    for(let i = 0; i < arrayResult.length; i++){
        if(typeof arrayResult[i] === "number"){
            continue;
        }
        if(typeof arrayResult[i] === "string"){
            if( !isNaN(Number(arrayResult[i])) ){
                arrayResult[i] = Number(arrayResult[i]);
                continue;
            }

            continue;
        }

    }

    return arrayResult;
}

export function getRegex(input){
    if(typeof input === "object")
        return new RegExp(input);
    return input;
}

export function capitalFirst(theString){
    return theString[0].toUpperCase() + theString.substring(1);
}