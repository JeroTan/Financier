export function strArrtToArr(input, strSplitter = ","){
    try{
        if( !(typeof input === string || Array.isArray(input)) ){
            throw new Error;
        }
    }catch(e){
        console.error("Input is neither Array or String on strArrToArr helper function.");
    }
    if(Array.isArray(input)){
        return input;
    }
    return input.split(strSplitter);
}