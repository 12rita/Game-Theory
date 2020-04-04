let matrix = [[17, 4, 9], [0, 16, 9], [12, 2, 19]];

let x0 = [17, 4, 9];
let x1 = [0, 16, 9];
let x2 = [12, 2, 19];

let x = [x0, x1, x2];

let y0 = [17, 0, 12];
let y1 = [4, 16, 2];
let y2 = [9, 9, 19];

let y = [y0, y1, y2];

let strategyA = [...y0];//выигрыши А, при условии выбора y1
let strategyB = [...x0];//проигрыши В, при условии выбора x1
let wins = [];
let looses = [];
let eps = 13;
let counter = 1;
let epsilons = [];
let priceA = [];
let priceB = [];

let strategyAVector = {
    0: 1,
    1: 0,
    2: 0
};
let strategyBVector = {
    0: 1,
    1: 0,
    2: 0
};

// При равенстве элементов в строке, выбираем следующую стратегию рандомно
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Выбираем максимальный выигрыш

function findMaxWin(strategy) {
    let maxWin = strategy[0];
    let maxIdx = 0;
    if (strategy[0] === strategy[1] && strategy[1] === strategy[2]) {
        maxIdx = getRandomInt(3);

    } else {
        strategy.forEach(function (item, idx) {
            if (item >= maxWin) {
                maxWin = item;
                maxIdx = idx;

            }

        })
    }

    wins.push(strategy[maxIdx] / counter);
    strategyAVector[maxIdx]++;
    return maxIdx;

}

// Выбираем минимальный проигрыш
function findMinLoose(strategy) {
    let minLoose = strategy[0];
    let minIdx = 0;
    if (strategy[0] === strategy[1] && strategy[1] === strategy[2]) {
        minIdx = getRandomInt(3);
    } else {
        strategy.forEach(function (item, idx) {
            if (item <= minLoose) {
                minLoose = item;
                minIdx = idx;
            }

        })

    }

    looses.push(strategy[minIdx] / counter);
    strategyBVector[minIdx]++;
    return minIdx;
}
//Вычисляем эпсилон
function findE() {
    return eps = Math.min(...wins) - Math.max(...looses);

}

//Суммируем стратегии
function sum(strategy, neutrality) {

    for (let i = 0; i < 3; i++) {
        strategy[i] += neutrality[i];


    }
    return strategy;

}

let table = [];

function algorithm() {

    let k = findMaxWin(strategyA);
    let l = findMinLoose(strategyB);
    eps = findE();
    epsilons.push(eps);
    table.push({
        StratA: strategyA,
        StratB: strategyB,
        Win_A: wins[wins.length - 1].toFixed(2),
        Win_B: looses[looses.length - 1].toFixed(2),
        Eps: eps.toFixed(2)
    });


    while (eps > 0.1) {
        counter++;
        strategyA = sum(strategyA, y[l]);
        strategyB = sum(strategyB, x[k]);

        k = findMaxWin(strategyA);
        l = findMinLoose(strategyB);
        eps = findE();
        epsilons.push(eps);

        let minWin = Math.min(...wins);
        let maxLoose = Math.max(...looses);
        priceA.push(minWin);
        priceB.push(maxLoose);

        table.push({
            StratA: strategyA,
            StratB: strategyB,
            Win_A: wins[wins.length - 1].toFixed(2),
            Win_B: looses[looses.length - 1].toFixed(2),
            Eps: eps.toFixed(2)
        })
    }
    strategyAVector[k]--;
    strategyBVector[l]--;


    let minWin = Math.min(...wins);
    let maxLoose = Math.max(...looses);


    console.table(table);
    let priceAverage = (minWin + maxLoose) / 2;

    let vecA = [(strategyAVector[0] / counter).toFixed(3), (strategyAVector[1] / counter).toFixed(3), (strategyAVector[2] / counter).toFixed(3)];
    let vecB = [(strategyBVector[0] / counter).toFixed(3), (strategyBVector[1] / counter).toFixed(3), (strategyBVector[2] / counter).toFixed(3)];


    console.log('Итеративный метод ' + '\n'
        + 'Цена игры: ' + priceAverage.toFixed(2) + '\n' +
        'Количество итераций: ' + counter + '\n' +
        'Стратегия игрока А: ' + vecA + '\n' +
        'Стратегия игрока В: ' + vecB);


    let cU = [120 / 3566, 170 / 3566, 94 / 3566]; //Результат умножения вектора u на матрицу, обратную к С
    let uC = [202 / 3566, 171 / 3566, 11 / 3566]; //Результат умножения матрицы, обратной к С на вектор u
    let uCu = [uC[0] + uC[1] + uC[2]]; //Вычисление знаменателя
    let xAn = [(uC[0] / uCu).toFixed(3), (uC[1] / uCu).toFixed(3), (uC[2] / uCu).toFixed(3)];
    let yAn = [(cU[0] / uCu).toFixed(3), (cU[1] / uCu).toFixed(3), (cU[2] / uCu).toFixed(3)];
    let cAn = [(1 / uCu).toFixed(2)];


    console.log('Аналитический метод\n' +
        'Стратегия игрока А: ' + xAn + '\n' +
        'Стратегия игрока B: ' + yAn + '\n' +
        'Цена игры: ' + cAn);

    return eps;


}

algorithm();
