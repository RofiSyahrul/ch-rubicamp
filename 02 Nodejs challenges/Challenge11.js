const fs = require('fs');
const readline = require('readline');

process.stdin.setEncoding('utf8');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Tebakan: '
});

console.log('Selamat datang di permainan Tebak Kata. Silakan isi dengan jawaban yang benar ya!');

// file data.json diletakkan di folder yang sama dengan file ini.
fs.readFile('data.json','utf8', (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    var questNum = 0;
    console.log('\nPertanyaan: '+data[questNum].definition);
    rl.prompt();
    function readLine (line) {
        if (line.toLowerCase()===data[questNum].term.toLowerCase()) {
            // jawaban benar
            console.log('Selamat Anda Benar!');
            questNum++;
            if (questNum<data.length){
                // next question
                console.log('\nPertanyaan: '+data[questNum].definition);
                rl.prompt();
            }else {
                // udahan
                console.log('\nHore Anda Menang!');
                rl.close();
            }
        }else{
            // jawaban salah
            console.log('Wkwkwkwk, Anda kurang beruntung!\n');
            rl.prompt();
        }
    }
    rl.on('line', readLine);
    rl.on('close', process.exit)
});