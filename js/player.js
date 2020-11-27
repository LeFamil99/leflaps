class Player {
    constructor(gravity, height, width, jumps, radius, i, genome = new Genome(3, 1)) {
        this.width = width;
        this.gravity = gravity;
        this.height = height;
        this.jumps = jumps;
        this.radius = radius;
        this.yVel = 0;
        this.y = height / 2;
        this.x = width / 2.5;
        this.color = 'yellow'
        this.i = i;
        this.dead = false
        this.genome = genome
        
    }

    update() {
        this.yVel += (gravity / 2) * frameLength 
        this.y = this.y < this.height - this.radius ? this.y + this.yVel * frameLength : this.y = this.height - this.radius;
        if (this.i === 0)
            
        /*ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();*/
        if (this.dead && !dead) 
            this.x -= obstacleSpeed  * frameLength 
        ctx.save()
        ctx.translate(this.x, this.y );
        ctx.rotate((Math.PI / 180) * (105 * (1 / (1 + Math.exp(-0.7 * (this.yVel - 9.5)))) - 20));
        
        ctx.drawImage(flappy, -(17 / 12) * this.radius, -this.radius, (17 / 12) * this.radius * 2, this.radius * 2)
        ctx.restore();
        if (!this.dead) {
            //console.log(this.x - this.radius, obstacles[nextObs].x + obstacles[nextObs].width / 2)
            //console.log(obstacles[nextObs])
            if (this.x - this.radius > obstacles[nextObs].x + obstacles[nextObs].thickness / 2) {
                nextObs = (nextObs + 1) % 2
                //console.log(nextObs)
            }
        }
    }

    jump() {
        if(!this.dead)
            this.yVel = -this.jumps;
    }

    death() {
        if (!this.dead) {
            this.dead = true
            this.yVel = 0
            this.color = 'red'
            deathCount++;
            speciesOrder.push([this, offY])
            //console.log(this.i, deathCount)
            if (deathCount >= numPlayer) {
                firstGame = false;
                dead = true
                button.style.display = 'block';
                document.getElementById('p').innerHTML = 'Restart'
                highScore = score > highScore ? score : highScore;
                //console.log(speciesOrder)
                generatePopulation(numPlayer);
                reset()
                
            }
        }
        
    }

    generateOutput() {
        let N = [];
        let O = obstacles[nextObs]
        N.push(((this.y - this.radius) - (O.y - O.gap / 2)) / canvas.height)
        N.push(((O.y + O.gap / 2) - (this.y + this.radius)) / canvas.height)
        N.push(Math.max((O.x - O.thickness / 2) - (this.x + this.radius), 0) / canvas.width)
        //N.push()
        if (this.i === 0 || this.i === 32) {
            //console.log('0')
            /*ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.radius);
            ctx.lineTo(this.x, (O.y - O.gap / 2));
            ctx.strokeStyle = 'red'
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.radius);
            ctx.lineTo(this.x, (O.y + O.gap / 2));
            ctx.strokeStyle = 'blue'
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo((O.x - O.thickness / 2), this.y);
            ctx.lineTo((this.x + this.radius), this.y);
            ctx.strokeStyle = 'yellow'
            ctx.stroke();*/
        }
        return N
    }

}