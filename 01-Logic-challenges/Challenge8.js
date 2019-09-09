function pola(str){
    function replaceChar(str,id,by){
        if (id>=0) return str.replace(str[id],by);
        return str;
    }
    function checkExpression(strArr, operator){
        numArr = strArr.map(x=>Number(x))
        switch(operator){
            case '*': return numArr[0]*numArr[1]===numArr[2];
            case '/': return numArr[0]/numArr[1]===numArr[2];
            case '+': return numArr[0]+numArr[1]===numArr[2];
            case '-': return numArr[0]-numArr[1]===numArr[2];
            default: return numArr[0]*numArr[1]===numArr[2];
        }
    }
    var operator = str.match(/[^0-9 #=]/g)[0];
    var leftRight = str.split(' = ');
    var nums = leftRight[0].split(` ${operator} `).concat(leftRight[1]);
    var hashId = nums.map(x=>x.indexOf('#'));
    for(var i=0; i<=9; i++){
        for (var j=0; j<=9; j++){
            var candidate = [i,0,j];
            var numsCandidate = [...Array(3).keys()].map(x=>replaceChar(nums[x],hashId[x],candidate[x].toString()));
            if (checkExpression(numsCandidate, operator)) {
                candidate.splice(1,1);
                return candidate;
            }
        }
    }
    return 'not found';
}
console.log(pola('42#3 * 188 = 80#204'));
console.log(pola('8#61 * 895 = 78410#5'));