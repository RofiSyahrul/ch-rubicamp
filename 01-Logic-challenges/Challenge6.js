function sentencesManipulation(sentence){
    function stringManipulation(word){
        if ('aiueo'.includes(word[0].toLowerCase())) return word;
        return word.slice(1,word.length).concat(word[0],'nyo');
    }
    // Memasukkan setiap kata ke dalam array.
    // Selanjutnya, setiap elemen array tersebut dijadikan argumen untuk function stringManipulation.
    // Kemudian, hasilnya digabungkan menjadi string yang dipisah oleh spasi.
    console.log(sentence.split(' ').map(stringManipulation).join(' '));
}
sentencesManipulation('ibu pergi ke pasar bersama aku');