function deretKaskus(n){
    function kaskus(num){
        if (num%5===0 & num%6===0) return "KASKUS";
        if (num%5===0) return "KAS";
        if (num%6===0) return "KUS";
        return num;
    }
    return [...Array(n).keys()].map(x=>(x+1)*3).map(kaskus);
}
console.log(deretKaskus(10));