import Vector from "../helpers/Vector";

class Player {
    constructor(pos) {
        this.pos = pos.plus(new Vector(0.2, 0.2));
        this.size = new Vector(0.6, 0.6);
        this.speed = new Vector(0, 0);
        this.color = 'black';
        this.touched = false;
        this.touchedColor = 'red';
        this.initialSpeed = 6;
        this.speedX = this.initialSpeed;

        this.initialOptions = {
            jumpEnergy: 15
        };

        // gravity
        this.gravity = 28;
        this.jumped = false;
        this.jumpForce = 5;
        this.jumpsCount = 1;
        this.jumpEnergy = this.initialOptions.jumpEnergy;
    }

    act(level, keys) {
        if (keys.z) {
            this.speedX = this.initialSpeed + 2;
        } else {
            this.speedX = this.initialSpeed;
        }

        this.moveX(level, keys);
        this.moveY(level, keys);

        const otherActor = level.actorAt(this);
        if (otherActor) {
            otherActor.touched = true;
            level.playerTouched(otherActor, this);
        }
    }

    moveX(level, keys) {
        this.speed.x = 0;
        if (keys.left) this.speed.x -= this.speedX;
        if (keys.right) this.speed.x += this.speedX;
        const motion = new Vector(this.speed.x * level.step, 0);
        const newPos = this.pos.plus(motion);
        const obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle.type) {
            this.collides(level, obstacle);
            level.playerTouched(obstacle.type, this);
            if (this.speed.x > 0) {
                this.pos.x = obstacle.pos.x - this.size.x;
            } else if (this.speed.x < 0) {
                this.pos.x = obstacle.pos.x + 1;
            }
            this.speed.x = 0;
        } else {
            this.pos = newPos;
        }
    }

    moveY(level, keys) {
        this.speed.y += level.step * this.gravity;
        const motion = new Vector(0, this.speed.y * level.step);
        const newPos = this.pos.plus(motion);

        if (newPos.y + this.size.y > level.height) {
            level.status = 'lost';
        }

        if (!keys.up && this.jumped) {
            this.jumpEnergy = 0;
            this.jumped = false;
            this.jumpsCount -= 1;
        }

        const obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle.type) {
            this.collides(level, obstacle);
            level.playerTouched(obstacle.type, this);

            this.jumpEnergy = 0;

            if (this.speed.y > 0) {
                this.jumped = false;
                this.pos.y = obstacle.pos.y - this.size.y;
                this.jumpEnergy = this.initialOptions.jumpEnergy;
                this.jumpsCount = 2;
            } else {
                this.pos.y = obstacle.pos.y + 1;
            }

            this.speed.y = 0;

            if (keys.up && !this.jumped && this.jumpsCount > 0) {
                this.jumpEnergy = this.initialOptions.jumpEnergy;
                this.jumped = true;
                this.speed.y = -this.jumpForce;
            }

        } else {
            if (keys.up) {
                if (!this.jumped && this.jumpsCount > 0){
                    this.jumpEnergy = this.initialOptions.jumpEnergy;
                    this.jumped = true;
                }
                if (this.jumpEnergy > 0) {
                    this.speed.y = -this.jumpForce - 2;
                    this.jumpEnergy -= 1;
                }
            }
            this.pos = newPos;
        }
    }

    collides(level, obstacle) {
        obstacle.actors.forEach(type => {
            if (type === 'lava') {
                level.status = 'lost';
            }
        });
    }

    draw(ctx, level) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x * level.size, this.pos.y * level.size, this.size.x * level.size, this.size.y * level.size);
        ctx.fill();
    }
}

export default Player;
