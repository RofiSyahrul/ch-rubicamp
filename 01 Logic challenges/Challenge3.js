function romawi(n){
    const baseChar = ['M','D','C','L','X','V','I'];
    let arrRom = []; let num = n;
    for (var i=0; i<4; i++){
        var ten = Math.pow(10,3-i);
        digit = Math.floor(num/ten);
        num = num%ten;
        if(i==0){
            arrRom.push(baseChar[i].repeat(digit));
        }else{
            var id1 = 2*i; var id5 = 2*i-1; var div5 = Math.floor(digit/5); var mod5 = digit%5;
            if (div5==1 & mod5==4) arrRom.push([baseChar[id1],baseChar[id5-1]].join(''));
            else if (div5==1) arrRom.push([baseChar[id5],baseChar[id1].repeat(mod5)].join(''));
            else if (mod5==4) arrRom.push([baseChar[id1],baseChar[id5]].join(''));
            else arrRom.push(baseChar[id1].repeat(mod5));
        }
    }
    return arrRom.join('');

}
console.log('Script Testing untuk Konversi Romawi\n');
console.log('input | expected | result');
console.log('------|----------|-------');
console.log('4     | IV       | ',romawi(4));
console.log('9     | IX       | ',romawi(9));
console.log('13    | XIII     | ',romawi(13));
console.log('1453  | MCDLIII  | ',romawi(1453));
console.log('1646  | MDCXLVI  | ',romawi(1646));

for (i=1; i<100; i++){
    console.log(`${i}: ${romawi(i)}\n`)
}