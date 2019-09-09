function weirdMultiply(num){
    if (num.toString().length==1) return num;
    return weirdMultiply(num.toString().split('').map(Number).reduce((a,b)=>a*b));
}

console.log(weirdMultiply(39));
console.log(weirdMultiply(999));
console.log(weirdMultiply(3));