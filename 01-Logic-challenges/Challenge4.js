function indexPrime(param1){
    let id = 0; let num = 1;
    while (id<param1){
        num++;
        let prime = true;
        for (var factor=2; factor<=Math.sqrt(num); factor++){
            if (num%factor===0) {
                prime = false; break;
            }
        }
        if (prime) id++;
    }
    return num;
}

console.log(indexPrime(4));
console.log(indexPrime(500));
console.log(indexPrime(37786));
console.log(indexPrime(37787));