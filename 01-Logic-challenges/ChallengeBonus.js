function printOscilatedInteger(number, separator = ' '){
    // created by: Rofi
    function oscilatedInteger(num,iter=0,n=num,plus5=Math.ceil(n/5)){
        if (iter>0 & n===num) return [num];
        if (num<=0 | iter>=plus5) return [num].concat(oscilatedInteger(num+5, iter=iter+1, n=n));
        return [num].concat(oscilatedInteger(num-5, iter=iter+1, n=n));
        
    }
    return oscilatedInteger(number).join(separator);

}

// readline interface is adapted from Pradeep Palakurthi in stackoverflow https://stackoverflow.com/questions/38747479/read-multiple-input-lines-using-javascript
var readline = require('readline');
var lineNumber = 0;
var NumOfNum;

process.stdin.setEncoding('utf8');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: '> '
});

rl.on('line', readLine);
console.log("Provide number of test cases:");
function readLine (line) {
    if (lineNumber == 0) {
        if (!isNaN(parseInt(line))) {
            NumOfNum = parseInt(line);
            lineNumber++;
            console.log("Provide " + NumOfNum + " natural numbers sepearted by space as test cases: ");
        } else {
            console.log("Invalid Input");
        }
    } else {
        var nums = line.split(" ");
        if (nums.length != NumOfNum) {
            console.log("Given more/less than " + NumOfNum + " Try again");
        } else {
            var result = nums.map(x=>printOscilatedInteger(Number(x),' '));
            console.log('\nOscilated Integer:');
            console.log(result.map(x=>`${nums[result.indexOf(x)]}: `.concat(x)).join('\n'));
            process.exit();
        }
    }
}