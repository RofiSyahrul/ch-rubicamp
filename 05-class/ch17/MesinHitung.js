class MesinHitung {
    constructor(){
        this.x = 1;
    }
    add(y){
        this.x += y;
        return this;
    }
    subtract(y){
        this.x -= y;
        return this;
    }
    multiply(y){
        this.x *= y;
        return this;
    }
    divide(y){
        this.x /= y;
        return this;
    }
    exponent(y){
        this.x = Math.pow(this.x,y);
        return this;
    }
    square(){
        return this.exponent(2);
    }
    squareRoot(){
        this.x = Math.sqrt(this.x);
        return this;
    }
    result(){
        console.log(this.x);
    }
}

const Pi = 22/7;

export {MesinHitung, Pi};