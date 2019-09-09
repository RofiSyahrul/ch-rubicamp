function sentencesManipulation(sentence){
    function stringManipulation(word){
        if ('aiueo'.includes(word[0].toLowerCase())) return word;
        return word.slice(1,word.length).concat(word[0],'nyo');
    }
    return sentence.split(' ').map(stringManipulation).join(' ');
}
function readLine (line) {
    if (line.toLowerCase().match('bye')!=null) rl.close();
    console.log('hasil konversi: '+sentencesManipulation(line));
    rl.prompt();
}

var readline = require('readline');
process.stdin.setEncoding('utf8');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Tulis kalimatmu disini > '
});
rl.on('line', readLine);
rl.on('close', process.exit);
rl.prompt();