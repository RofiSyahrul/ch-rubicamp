function sum(){
    sum_ = 0; //initialization
    for (var i_=0;i_<arguments.length;i_++){
        sum_+=arguments[i_];
    }
    console.log(sum_);
}

sum(1,2,7);
sum(1,4);
sum(11);
sum(10,3,6,7,9);