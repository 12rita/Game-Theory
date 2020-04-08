let braunRobinson = require('../lab1/lab1');

function findSaddlePoint(matrix) {

    let matrixMin = [[]];
    let matrixMax = [[]];
    for (let i = 0; i < matrix.length; i++) {
        matrixMin[i] = [];
        matrixMax[i] = [];
    }

    for (let i = 0; i < matrix.length; i++) {

        for (let j = 0; j < matrix.length; j++) {
            matrixMin[i][j] = undefined;
            matrixMax[i][j] = undefined;
        }
    }

    let idxMin = 0;
    let idxMax = 0;

    for (let i = 0; i < matrix.length; i++) {
        let minEl = matrix[i][0];
        let maxEl = matrix[0][i];

        for (let j = 0; j < matrix.length; j++) {


            if (matrix[i][j] < minEl) {
                minEl = matrix[i][j];
                idxMin = j;

            }
            if (matrix[j][i] > maxEl) {
                maxEl = matrix[j][i];
                idxMax = j;
            }

        }
        matrixMin[i][idxMin] = minEl;
        matrixMax[idxMax][i] = maxEl;
    }
    for (let i = 0; i < matrix.length; i++) {

        for (let j = 0; j < matrix.length; j++) {
            if (matrixMax[i][j] && matrixMin[i][j]) {
                return {
                    value: matrixMax[i][j],
                    x: Number((i / (matrix.length - 1)).toFixed(3)),
                    y: Number((j / (matrix.length - 1)).toFixed(3))

                }
            }


        }
    }
    return 0;

}

function kernel(x, y) {
    let a = -15;
    let b = 20 / 3;
    let c = 40;
    let d = -12;
    let e = -24;
    return Number((a * x * x + b * y * y + c * x * y + d * x + e * y).toFixed(3));

}

function buildMatrix(N) {
    let matrix = [];

    for (let i = 0; i < N + 1; i++) {
        matrix[i] = [];
    }


    for (let i = 0; i < N + 1; i++) {
        for (let j = 0; j < N + 1; j++) {
            matrix[i][j] = kernel(i / N, j / N);
        }
    }
    console.table(matrix);
    return matrix;

}

function findH(matrix, x, y) {
    let H = 0;
    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < y.length; j++) {
            H += matrix[i][j] * x[i] * y[j];
        }
    }
    return H;

}

function findClosest(H, matrix) {
    let matrixDist = [];
    for (let i = 0; i < matrix.length; i++) {
        matrixDist[i] = [];

    }


    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            matrixDist[i][j] = Math.abs(matrix[i][j] - H);
        }
    }

    let minEl = Math.min(...[].concat(...matrixDist));
    //let braunRobDesicion = {};
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (matrixDist[i][j] === minEl) {

                return ({
                    value: matrix[i][j],
                    x: Number((i / (matrix.length - 1)).toFixed(3)),
                    y: Number((j / (matrix.length - 1)).toFixed(3))

                })


            }
        }
    }

}

function algorithm() {
    let e = 0;
    let prices = [];
    let counter = 0;
    let N = 2;
    let flag = false;
    while (counter<5) {
        console.log('\n' + 'N=' + N);
        let matrix = buildMatrix(N);
        let saddlePoint = findSaddlePoint(matrix);
        if (saddlePoint) {
            console.log('Есть седловая точка: ' + '\n' + `x=${saddlePoint.x} ` + `y=${saddlePoint.y} ` + `H=${saddlePoint.value}`);
            prices.push(saddlePoint.value);
        } else {
            let obj = braunRobinson(matrix);
            let H = findH(matrix, obj.x, obj.y);
            let b_r_Desicion = findClosest(H, matrix);
            console.log('Нет седловой точки. Решение методом Брауна-Робинсон: ' + 'x=' + b_r_Desicion.x + ' y=' + b_r_Desicion.y + ' H=' + b_r_Desicion.value);
            prices.push(b_r_Desicion.value);
        }
        if (prices.length>1){
            e = Math.abs(prices[prices.length-1]-prices[prices.length-2]);
            if (e<=0.01 && !flag){
                counter=1;
                flag = true;
            }
            else if (e<=0.01 && flag){
                counter++;
            }
            else if (e>0.01) {
                flag=false;
            }
        }
        N++;


    }

}

algorithm();
