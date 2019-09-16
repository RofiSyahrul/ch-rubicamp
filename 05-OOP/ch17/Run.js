import {MesinHitung, Pi} from './MesinHitung.js';

let mh = new MesinHitung();
mh.add(10).subtract(5).result();
mh.add(3).multiply(4).divide(6).result();
mh.x = 7;
console.log(`nilai sekarang : ${mh.x}`);
mh.multiply(2).multiply(Pi).result();
mh.x = 7;
mh.square().multiply(Pi).result();
mh.x = 4;
mh.exponent(3).result();
mh.squareRoot().result();