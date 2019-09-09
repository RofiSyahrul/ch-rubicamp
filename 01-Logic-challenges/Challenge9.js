function spiral(num){
    function spiralOrder(n,depth=0){
        // Recursive function to get spiral order on index of matrix
        if (n===1) return [`(${depth},${depth})`];
        else if (n===2) return [`(${depth},${depth})`,`(${depth},${depth+1})`,`(${depth+1},${depth+1})`,`(${depth+1},${depth})`];
        else{
            arrOrder = [];
            for (var j=0; j<n; j++){
                // top
                arrOrder.push(`(${depth},${depth+j})`);
            }
            for (var i=1; i<n; i++){
                // right
                arrOrder.push(`(${depth+i},${depth+n-1})`);
            }
            for (j=n-2; j>=0; j--){
                // bottom
                arrOrder.push(`(${depth+n-1},${depth+j})`);
            }
            for (i=n-2; i>=1; i--){
                // left
                arrOrder.push(`(${depth+i},${depth})`);
            }
            return arrOrder.concat(spiralOrder(n-2,depth=depth+1))
        }
    }

    var arrMat = [];
    for (var row=0; row<num; row++){
        arrMat.push([...Array(num).keys()].map(x=>x+num*row))
    }
    var indexOrder = spiralOrder(num);
    var applyOrder = function(ord){
        ordArr = ord.split(',').map(x=>Number(x.match(/[^()]/g).join('')));
        return arrMat[ordArr[0]][ordArr[1]];
    };
    console.log(indexOrder.map(applyOrder)); 
}

spiral(5);
spiral(6);
spiral(7);