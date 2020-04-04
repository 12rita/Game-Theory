const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');

//-------------------------------------------------------------------------
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xE6D3FF);//ffe4c4
let scene2 = new THREE.Scene();
scene2.background = new THREE.Color(0xE6D3FF);

let renderer = new THREE.WebGLRenderer();
let renderer2 = new THREE.WebGLRenderer();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth / 2.5, window.innerHeight / 2);
renderer2.setSize(window.innerWidth / 2.5, window.innerHeight / 2);
document.getElementById('scene').appendChild(renderer.domElement);
document.getElementById('scene2').appendChild(renderer2.domElement);

camera.position.z = 400;


let val = document.getElementById('count');

val.addEventListener('click', algorithm);

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function findDistance(point1, point2) {

    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2 + (point1.z - point2.z) ** 2)
}

function getRandomPoint(a, b, c) {
    let teta = getRandomArbitrary(0, Math.PI);
    let fi = getRandomArbitrary(0, 2 * Math.PI);
    let p = {
        x: a * Math.sin(teta) * Math.cos(fi),
        y: b * Math.sin(teta) * Math.sin(fi),
        z: c * Math.cos(teta)
    };
    //console.log(p);
    return p;
}

function game(a, b, c, r, points, gameCount) {

    let counter = 0;
    for (let i = 0; i < gameCount; i++) {
        let point = getRandomPoint(a, b, c);
        let goodPoint = points.find(function (item) {
            return (findDistance(item, point) <= r)

        });
        if (goodPoint !== undefined) {
            counter++;
            //console.log(counter);

        }

    }
    let price = (counter / gameCount);
    return (price);
    // console.log('Цена игры: ' + price + '%');


}

function randomDist(a, b, c, pointsCount, pointRadius) {
    let points = [];
    let pCounter = 0;
    while (pCounter < pointsCount) {
        let point = getRandomPoint(a, b, c);
        let checkFist = points.find(function (item) {
            return findDistance(point, item) <= 2 * pointRadius;

        });
        if (checkFist === undefined) {
            points.push(point);
            pCounter++;
        }

    }
    //console.log(points);
    return points;
}

function r2Dist(a, b, c, pointsCount) {

    let g = 1.32471795724474602596;
    let a1 = 1.0 / g;
    let a2 = 1.0 / (g * g);


    let points = [];

    for (let i = 0; i < pointsCount; i++) {
        let teta = ((a1 * (i + 1)) % 1) * Math.PI;
        let fi = ((a2 * (i + 1)) % 1) * 2 * Math.PI;


        let point = {
            x: a * Math.sin(teta) * Math.cos(fi),
            y: b * Math.sin(teta) * Math.sin(fi),
            z: c * Math.cos(teta)
        };
        points.push(point);
    }
    return points;
}


function algorithm(e) {
    e.preventDefault();
    scene.dispose();
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    scene2.dispose();
    while (scene2.children.length > 0) {
        scene2.remove(scene2.children[0]);
    }

    const frontSpot = new THREE.SpotLight(0xeeeece);
    frontSpot.position.set(1000, 1000, 1000);
    const frontSpot2 = new THREE.SpotLight(0xddddce);
    frontSpot2.position.set(-500, -500, -500);

    const frontSpot3 = new THREE.SpotLight(0xeeeece);
    frontSpot3.position.set(1000, 1000, 1000);
    const frontSpot4 = new THREE.SpotLight(0xddddce);
    frontSpot4.position.set(-500, -500, -500);

    scene.add(frontSpot, frontSpot2);
    scene2.add(frontSpot3, frontSpot4);

    let pointsCount = document.getElementById('number').value;
    let pointRadius = document.getElementById('radius').value;
    let gamesCount = document.getElementById('gameCount').value;
    let a = document.getElementById('a').value;
    let b = document.getElementById('b').value;
    let c = document.getElementById('c').value;

    let pointsRand = randomDist(a, b, c, pointsCount, pointRadius);
    let pointsR2 = r2Dist(a, b, c, pointsCount);

    let priceRandom = game(a, b, c, pointRadius, pointsRand, gamesCount);
    let priceR2 = game(a, b, c, pointRadius, pointsR2, gamesCount);
    console.log('Алгоритм рандомного распределения:' + '\n' + 'Цена игры: ' + priceRandom);
    console.log('Алгоритм распределения R2:' + '\n' + 'Цена игры: ' + priceR2);

    let matrix = new THREE.Matrix4().makeScale(a, b, c);

    let geometryEllipse = new THREE.SphereGeometry(1, 32, 32).applyMatrix4(matrix);
    let geometryEllipse2 = new THREE.SphereGeometry(1, 32, 32).applyMatrix4(matrix);

    const material = new THREE.MeshLambertMaterial({
        color: 0x9F0DFF,
        //specular: 0x9F0DFF,
        //emissive: 0x6809A8
        // wireframe: true
    });
    let ellipse = new THREE.Mesh(geometryEllipse, material);
    let ellipse2 = new THREE.Mesh(geometryEllipse2, material);

    scene.add(ellipse);
    scene2.add(ellipse2);

    let makeSphere = (item) => {
        const materialS = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            // wireframe: true
        });
        let Sphere = new THREE.Mesh(new THREE.SphereGeometry(pointRadius, 32, 32), materialS);
        Sphere.position.x = item.x;
        Sphere.position.y = item.y;
        Sphere.position.z = item.z;
        return Sphere;
    };

    let spherasRand = pointsRand.map(makeSphere);

    let spherasR2 = pointsR2.map(makeSphere);


    scene.add(...spherasRand);
    scene2.add(...spherasR2);
    console.log("ready")

}


function animate() {
    requestAnimationFrame(animate);
    // ellipse.rotation.x += 0.01;
    // ellipse.rotation.y += 0.01;

    // Sphere.rotation.y += 0.01;
    // ellipse.rotation.z +=0.01;
    controls.update();
    //controls2.update();
    renderer.render(scene, camera);
    renderer2.render(scene2, camera);

}


animate();