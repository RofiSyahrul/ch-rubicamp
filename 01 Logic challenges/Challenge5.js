function stringManipulation(word){
    if ('aiueo'.includes(word[0].toLowerCase())) console.log(word);
    else console.log(word.slice(1,word.length).concat(word[0],'nyo'));
}
stringManipulation('ayam');
stringManipulation('bebek');