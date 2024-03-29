export function createRandomUsername(length = 10){
    const uniq = uniqid();
    return "user"+uniq.substring(uniq.length-length);

}

export function uniqid(prefix = "", random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
};