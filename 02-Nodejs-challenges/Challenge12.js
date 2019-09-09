const process = require('process');
var args = process.argv;
if (args.length!=3){
    filePath = args[1].split('/');
    fileName = filePath[filePath.length-1];
    console.log('Tolong sertakan nama file sebagai inputan soalnya\nMisalnya \'node '+fileName+' data.json\'');
    process.exit();
}

const fs = require('fs');
const readline = require('readline');

process.stdin.setEncoding('utf8');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Jawaban: '
});
rl.on('close', process.exit);

function nextQuestion(qNum, dat, unAns){
    if (qNum<dat.length){
        // next question
        console.log('\nPertanyaan: '+dat[qNum].definition);
        rl.prompt();
    }else if (unAns.length>0){
        // next to skipped question
        console.log('\nPertanyaan: '+dat[unAns[0]].definition);
        rl.prompt();
    }else{
        // udahan
        console.log('\nAnda Berhasil!');
        rl.close();
    }
}

// file args[2] diletakkan di folder yang sama dengan file ini.
fs.readFile(args[2],'utf8', (err, data) => {
    if (err) throw err;
    console.log('Selamat datang di permainan Tebak-tebakan. Kamu akan diberikan pertanyaan dari file ini: \''+args[2]+'\'.');
    console.log('Untuk bermain, jawablah dengan jawaban yang sesuai.');
    console.log('Gunakan \'skip\' untuk menangguhkan pertanyaannya. Di akhir, pertanyaan tersebut akan ditanyakan lagi.');
    data = JSON.parse(data); var questNum = 0;
    var unanswered = [...Array(data.length).keys()];
    var countWrong = [...Array(data.length)].map(x=>0);
    console.log('\nPertanyaan: '+data[questNum].definition);
    rl.prompt();
    function readLine (line) {
        id = questNum<data.length ? questNum : unanswered[0];
        solution = data[id].term.toLowerCase();
        if (line.toLowerCase()==='skip'){
            // skip dulu jawabannya
            countWrong[id] = 0;
            questNum++;
            nextQuestion(questNum, data, unanswered);
        } else if (line.toLowerCase()===solution) {
            // jawaban benar
            console.log('\nAnda Beruntung!');
            unanswered = unanswered.filter(value=>value!==id); // eliminasi id dari unanswered
            questNum++;
            nextQuestion(questNum, data, unanswered);
        }else{
            // jawaban salah
            console.log('\nAnda Kurang Beruntung! anda telah salah ' + ++countWrong[id] + ' kali, silakan coba lagi');
            rl.prompt();
        }
    }
    rl.on('line', readLine);
});