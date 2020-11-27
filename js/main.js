console.log('Vlad')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const button = document.getElementById('button')
const test = document.getElementById('vlad');

let firstGame = true;
let speed = 1;
let score = 0;
let highScore = 0;
const gravity = 1
const obstacleSpeed = 3;
const obstacleGap = 165;
const obstacleThickness = 130;
const jumpStrength = 9.2
const playerRadius = 25;
const numPlayer = 40;
let nextObs = 0;
let deathCount = 0;
let offY = 0;
let ingame = false
let flappy = new Image()
let speciesOrder = []
flappy.src = 'https://lefamil99.github.io/Flappy2.png'
let pipe = new Image()
pipe.src = 'https://lefamil99.github.io/flappy-bird/pipe.png'

let player = []//= new Player(gravity, canvas.height, canvas.width, jumpStrength, playerRadius);
let obstacles = [];
//obstacles.push(new Obstacle(obstacleSpeed, canvas.width + obstacleThickness / 2, 300, canvas.width, canvas.height, obstacleGap, obstacleThickness))
//obstacles.push(new Obstacle(obstacleSpeed, canvas.width + obstacleThickness + canvas.width / 2, 500, canvas.width, canvas.height, obstacleGap, obstacleThickness))
let dead// = false

//Reset the game
const reset = () => {
    //console.log(1)
    if (firstGame) {
        player = [];
        for (let i = 0; i < numPlayer; i++) {
            player.push(new Player(gravity, canvas.height, canvas.width, jumpStrength, playerRadius, i));

        }
    }
    
    obstacles[0] = new Obstacle(obstacleSpeed, canvas.width + obstacleThickness / 2, 300, canvas.width, canvas.height, obstacleGap, obstacleThickness)
    obstacles[1] = new Obstacle(obstacleSpeed, canvas.width + obstacleThickness + canvas.width / 2, 500, canvas.width, canvas.height, obstacleGap, obstacleThickness)
    dead = false
    ingame = true
    button.style.display = 'none';
    score = 0;
    deathCount = 0;
    speciesOrder = []
    nextObs = 0;
    offY = 0;
}

//Check if player collides with an obstacle
const checkCollision = (x, y, r, minX, minY, maxX, maxY) => {
    var dx = Math.max(minX - x, 0, x - maxX);
    var dy = Math.max(minY - y, 0, y - maxY);
    d = Math.sqrt(dx * dx + dy * dy);
    return d < r

}

/*//Handles each player's death
const death = (i) => {
    player[i].death()
    deathCount++
    console.log(deathCount, numPlayer)
    if (deathCount >= numPlayer) {
        dead = true
        button.style.display = 'block';
        document.getElementById('p').innerHTML = 'Restart'
        highScore = score > highScore ? score : highScore;
    }
}*/

var d = new Date();
var milli = d.getMilliseconds();
let frameLength

//----------------------------------------------------------------------------------------------------
//Executes each frame
const update = () => {
    d = new Date();
    //Evaluates the frame length so that the game is fluid
    frameLength = (d.getMilliseconds() - milli) / 17
    if (frameLength < 0) frameLength = (d.getMilliseconds() + 1000 - milli) / 17
    if (frameLength < 0.5) console.log(frameLength)
    milli = d.getMilliseconds();
    for (let i = 0; i < speed; i++) {
        

        //Moves and updates every player
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i in player) {
            if (!player[i].dead) {
                player[i].update();
                let inp = player[i].generateOutput()
                let out = player[i].genome.feedForward(inp)
                //console.log(out.value[0][0])
                if (out.value[0][0] && i !== '0') player[i].jump();
                if (i === '0') {
                    test.innerHTML = String((inp[0])) + '<br>' + String((inp[1])) + '<br>' + String((offY))
                }
            }
        }

        if (ingame) {
            //Checks if the player should be dead
            if (!dead) {
                offY += obstacleSpeed * frameLength * speed
                for (let i in obstacles) {
                    obstacles[i].update();
                    obstacles[i].points(canvas.width / 2.5, player[0].radius)
                    for (let j in player) {
                        if (obstacles[i].x < -(obstacleThickness / 2)) {
                            obstacles[i] = new Obstacle(obstacleSpeed, canvas.width + obstacleThickness / 2, Math.random() * 520 + 190, canvas.width, canvas.height, obstacleGap, obstacleThickness)
                        }
                        //letters in canvas
                        //console.log(obstacles[i].x - obstacles[i].thickness / 2, 0, obstacles[i].x + obstacles[i].thickness / 2, obstacles[i].y - obstacles[i].gap / 2)
                        if (checkCollision(player[j].x, player[j].y, playerRadius, obstacles[i].x - obstacles[i].thickness / 2, 0, obstacles[i].x + obstacles[i].thickness / 2, obstacles[i].y - obstacles[i].gap / 2)) {
                            player[j].death()
                        }
                        if (checkCollision(player[j].x, player[j].y, playerRadius, obstacles[i].x - obstacles[i].thickness / 2, obstacles[i].y + obstacles[i].gap / 2, obstacles[i].x + obstacles[i].thickness / 2, canvas.height)) {
                            player[j].death()
                        }
                        if (player[j].y >= canvas.height - playerRadius || player[j].y <= 0) {
                            player[j].death()
                        }
                    }

                }

            } else {
                //Moves and updates the obstacles

                obstacles[0].update(false);
                obstacles[1].update(false);
            }
            //Displays the score and high score
            ctx.fillStyle = 'black';
            ctx.font = "50px Georgia";
            ctx.fillText(String(score), 500, 50);
            ctx.font = "15px Georgia";
            ctx.fillText('High score : ' + String(highScore), 475, 80);
        }
    }
    
 
    window.requestAnimationFrame(update)
}
update();

const generatePopulation = n => {
    player = []
    let N = speciesOrder;
    console.log(speciesOrder)
    let tot = 0;
    for (let i in N) {
        tot += N[i][1] ** 2
    }
    //console.log(tot)
    for (let j = 0; j < n - 1; j++) {
        let choice = Math.random() * tot;
        let chosenOne = N.length - 1;
        /*for (let i = N[chosenOne][1] ** 2; i < choice; i += N[chosenOne][1] ** 2) {
            chosenOne--
        }*/
        console.log(chosenOne)
        player.push(new Player(gravity, canvas.height, canvas.width, jumpStrength, playerRadius, j, new Genome(3, 1, N[chosenOne][0].genome.weights.value)))
        console.log(j, player[j].genome.weights.value)
        player[j].genome.mutate(sig(10000000/N[chosenOne][1]) * 2 - 1)
        console.log(j, player[j].genome.weights.value)
        //console.log(N[N.length - 1 - chosenOne][0].genome)
        //console.log(player[player.length - 1].genome.weights.value)
    }
    player.push(new Player(gravity, canvas.height, canvas.width, jumpStrength, playerRadius, n - 1, new Genome(3, 1, N[N.length - 1][0].genome.weights.value)))
    //console.log(j, player[j].genome.weights.value)
    player[n - 1].genome.mutate(sig(10000000 / N[N.length - 1][1]) * 2 - 1)
    //console.log(j, player[j].genome.weights.value)
    
}

document.onkeypress = e => {
    if (!dead && ingame) {
        /*switch (e.keyCode) {
            case 32:
                player[1].jump()
                break;
        }*/
        player[e.keyCode].jump()
    }
}

document.onmousedown = e => {
    if (!dead && ingame) {
        player[0].jump()
    }
}

const sig = x => {
    return 1 / (1 + Math.exp(-x))
}

const lessSpeed = () => {
    speed--
}

const moreSpeed = () => {
    speed++
}