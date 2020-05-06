let matrix = [[17, 4, 9], [0, 16, 9], [12, 2, 19]];

let x0 = [17, 4, 9];
let x1 = [0, 16, 9];
let x2 = [12, 2, 19];

let x = [x0, x1, x2];

let y0 = [17, 0, 12];
let y1 = [4, 16, 2];
let y2 = [9, 9, 19];

let y = [y0, y1, y2];

//let strategyA = [...y0];//выигрыши А, при условии выбора y1
//let strategyB = [...x0];//проигрыши В, при условии выбора x1

//let eps = 13;

let epsilons = [];
let priceA = [];
let priceB = [];

// let strategyAVector = {
//     0: 1,
//     1: 0,
//     2: 0
// };
// let strategyBVector = {
//     0: 1,
//     1: 0,
//     2: 0
// };


function transponation(matrix) {
    let matrixCopy = [];
    for (let i = 0; i < matrix.length; i++) {
        matrixCopy[i] = [];

    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            matrixCopy[i][j] = matrix[j][i];
        }
    }
    return matrixCopy;

}

// При равенстве элементов в строке, выбираем следующую стратегию рандомно
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Выбираем максимальный выигрыш

function findMaxWin(strategy, strategyAVector, wins, counter) {
    let maxWin = strategy[0];
    let maxIdx = 0;
    let flag = false;

    strategy.reduce(function (accum, item) {
        if (item === accum) {
            return item;
        } else {
            flag = true;

        }

    });
    // if (strategy[0] === strategy[1] && strategy[1] === strategy[2]) {
    //     maxIdx = getRandomInt(3);
    //
    // }
    if (!flag) {
        maxIdx = getRandomInt(strategy.length);
    } else {
        strategy.forEach(function (item, idx) {
            if (item >= maxWin) {
                maxWin = item;
                maxIdx = idx;

            }

        })
    }
    //console.log('максимум в строке: ' + strategy[maxIdx]);

    wins.push(strategy[maxIdx] / counter);
    //console.log("wins"+wins)

    strategyAVector[maxIdx]++;
    return maxIdx;

}

// Выбираем минимальный проигрыш
function findMinLoose(strategy, strategyBVector, looses, counter) {

    let minLoose = strategy[0];
    let minIdx = 0;
    let flag = false;
    // if (strategy[0] === strategy[1] && strategy[1] === strategy[2]) {
    //     minIdx = getRandomInt(3);
    // }
    strategy.reduce(function (accum, item) {
        if (item === accum) {
            return item;
        } else {
            flag = true;

        }

    });
    if (!flag) {
        minIdx = getRandomInt(strategy.length);
    } else {
        strategy.forEach(function (item, idx) {
            if (item <= minLoose) {
                minLoose = item;
                minIdx = idx;
            }

        })

    }
    //console.log("минимум в строке: " + strategy[minIdx]/ counter);

    looses.push(strategy[minIdx] / counter);
    strategyBVector[minIdx]++;
    return minIdx;
}

//Вычисляем эпсилон
function findE(wins, looses) {
    //console.log(Math.min(...wins) - Math.max(...looses));

    return (Math.min(...wins) - Math.max(...looses));

}

//Суммируем стратегии
function sum(strategy, neutrality) {

    for (let i = 0; i < strategy.length; i++) {
        strategy[i] += neutrality[i];


    }
    return strategy;

}


function algorithm(matrix) {
    let wins = [];
    let looses = [];
    let counter = 1;
    let strategyAVector = {};
    let strategyBVector = {};
    let table = [];
    for (let i = 0; i < matrix.length; i++) {
        strategyAVector[i] = 0;
        strategyBVector[i] = 0;
    }
    strategyAVector[0] = 1;
    strategyBVector[0] = 1;
    let eps = 0;
    let strategyA = [...transponation(matrix)[0]];
    let strategyB = [...matrix[0]];
    let aCopy = [...strategyA];
    let bCopy = [...strategyB];
    let k = findMaxWin(strategyA, strategyAVector, wins, counter);
    let l = findMinLoose(strategyB, strategyBVector, looses, counter);
    //console.log(strategyA + '\n' + strategyB);

    //console.log("wins2 " +wins)
    eps = findE(wins, looses);
    epsilons.push(eps);
    table.push({
        Choose_A: k,
        Choose_B: l,
        StratA: aCopy,
        StratB: bCopy,
        Win_A: wins[wins.length - 1].toFixed(2),
        Loose_B: looses[looses.length - 1].toFixed(2),
        Eps: eps.toFixed(2)
    });


    while (eps > 0.1) {
        counter++;
        // console.table(table);
        strategyA = sum(strategyA, transponation(matrix)[l]);
        strategyB = sum(strategyB, matrix[k]);

        let aCopy = [...strategyA];
        let bCopy = [...strategyB];

        k = findMaxWin(strategyA, strategyAVector, wins, counter);
        l = findMinLoose(strategyB, strategyBVector, looses, counter);
        eps = findE(wins, looses);
        epsilons.push(eps);

        let minWin = Math.min(...wins);
        let maxLoose = Math.max(...looses);
        priceA.push(minWin);
        priceB.push(maxLoose);

        table.push({
            Choose_A: k,
            Choose_B: l,
            StratA: aCopy,
            StratB: bCopy,
            Win_A: wins[wins.length - 1].toFixed(2),
            Loose_B: looses[looses.length - 1].toFixed(2),
            Eps: eps.toFixed(2)
        })
    }
    strategyAVector[k]--;
    strategyBVector[l]--;


    let minWin = Math.min(...wins);
    let maxLoose = Math.max(...looses);


    console.table(table);
    let priceAverage = (minWin + maxLoose) / 2;
    let vecA = [];
    let vecB = [];
    for (let i = 0; i < matrix.length; i++) {
        vecA.push((strategyAVector[i] / counter).toFixed(3));
        vecB.push((strategyBVector[i] / counter).toFixed(3));
    }

    //console.log(strategyAVector, strategyBVector);

    // let vecA = [(strategyAVector[0] / counter).toFixed(3), (strategyAVector[1] / counter).toFixed(3), (strategyAVector[2] / counter).toFixed(3)];
    // let vecB = [(strategyBVector[0] / counter).toFixed(3), (strategyBVector[1] / counter).toFixed(3), (strategyBVector[2] / counter).toFixed(3)];


    console.log('Итеративный метод ' + '\n'
        + 'Цена игры: ' + priceAverage.toFixed(2) + '\n' +
        'Количество итераций: ' + counter + '\n' +
        'Стратегия игрока А: ' + vecA + '\n' +
        'Стратегия игрока В: ' + vecB);

    //
    // let cU = [120 / 3566, 170 / 3566, 94 / 3566]; //Результат умножения вектора u на матрицу, обратную к С
    // let uC = [202 / 3566, 171 / 3566, 11 / 3566]; //Результат умножения матрицы, обратной к С на вектор u
    // let uCu = [uC[0] + uC[1] + uC[2]]; //Вычисление знаменателя
    // let xAn = [(uC[0] / uCu).toFixed(3), (uC[1] / uCu).toFixed(3), (uC[2] / uCu).toFixed(3)];
    // let yAn = [(cU[0] / uCu).toFixed(3), (cU[1] / uCu).toFixed(3), (cU[2] / uCu).toFixed(3)];
    // let cAn = [(1 / uCu).toFixed(2)];

    //
    // console.log('Аналитический метод\n' +
    //     'Стратегия игрока А: ' + xAn + '\n' +
    //     'Стратегия игрока B: ' + yAn + '\n' +
    //     'Цена игры: ' + cAn);

    // return eps;

    return {
        x: vecA,
        y: vecB
    }


}

algorithm(matrix);

module.exports = algorithm;
