export function transformDate(date){
    const dateMe = new Date(date);
    return `${dateMe.getFullYear()}, ${dateMe.getMonth()} ${dateMe.getDate()} | ${dateMe.getHours()}:${dateMe.getMinutes()}:${dateMe.getSeconds()}`;
}

export function getToday(){
    return transformDate(Date.now());
}