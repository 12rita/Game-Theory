function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

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

function generateMatrix() {
    let matrix = [];
    for (let i = 0; i < 10; i++) {
        matrix[i] = [];
    }
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            matrix[i][j] = {
                f: getRandomInRange(-100, 100),
                s: getRandomInRange(-100, 100)
            }
        }
    }
    console.table(matrix);
    return matrix;
}

function Nash(matrix) {
    let nashPoints = [];
    //let max_win_B = 0;
    let str = 0;
    let col = 0;
    let flag = false;
    for (let i = 0; i < matrix.length; i++) {
        let max_win_B = matrix[i][0];
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j].s >= max_win_B.s) {
                max_win_B = matrix[i][j];
                str = i;
                col = j;
                flag = true;
            }
        }
        for (let k = 0; k < matrix.length; k++) {
            if (transponation(matrix)[col][k].f > matrix[str][col].f) {
                flag = false;
                break;
            }
        }
        if (flag) {
            nashPoints.push(matrix[str][col]);
            //flag = false;
        }

    }
    console.log('Равновесие по Нэшу:');
    console.log(nashPoints);
    return nashPoints;
}

function findPareto(matrix, element) {

    for (let i = 0; i < matrix.length; i++) {

        for (let j = 0; j < matrix.length; j++) {

            if ((matrix[i][j].f >= element.f && matrix[i][j].s > element.s) ||
                (matrix[i][j].f > element.f && matrix[i][j].s >= element.s)) {

                return;

            }
        }

    }
    return element;
}

function Pareto(matrix) {
    let paretoPoints = [];
    for (let i = 0; i < matrix.length; i++) {

        for (let j = 0; j < matrix.length; j++) {
            let point = findPareto(matrix, matrix[i][j]);
            if (point) {
                paretoPoints.push(point);
            }

        }
    }
    console.log('Оптимальное по Парето:');
    console.log(paretoPoints);
    return paretoPoints;
}

function findOptima(matrix) {
    //let matrix = generateMatrix();

    let intersection = Nash(matrix).filter(x => Pareto(matrix).includes(x));
    console.log('Пересечение:');
    console.log(intersection);

}

function checkExamples() {
    let familyMatrix = [[{f: 4, s: 1}, {f: 0, s: 0}], [{f: 0, s: 0}, {f: 1, s: 4}]];
    let prisonersDilemma = [[{f: -5, s: -5}, {f: 0, s: -10}], [{f: -10, s: 0}, {f: -1, s: -1}]];
    let e1 = getRandomFloat(0, 1);
    let e2 = getRandomFloat(0, 1);
    let crossroads = [[{f: 1.0, s: 1.0}, {f: Number((1.0 - e1).toFixed(2)), s: 2}], [{
        f: 2.0,
        s: Number((1.0 - e2).toFixed(2))
    }, {f: 0, s: 0}]];

    console.log('Матрица для игры "Семейный спор"');
    console.table(familyMatrix);
    findOptima(familyMatrix);
    console.log('\n' + 'Матрица для игры "Дилемма заключённого"');
    console.table(prisonersDilemma);
    findOptima(prisonersDilemma);
    console.log('\n' + 'Матрица для игры "Перекрёсток"');
    console.table(crossroads);
    findOptima(crossroads);
}

function checkVariant() {
    let matrix = [[{f: 4, s: 7}, {f: 5, s: 2}], [{f: 0, s: 2}, {f: 7, s: 3}]];
    Nash(matrix);
}

//checkExamples();
//findOptima();
checkVariant();