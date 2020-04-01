import Vector from "../helpers/Vector";
import Actor from "./Actor";
import Colors from "../helpers/Colors";

class Player extends Actor {
    constructor(pos) {
        super();
        this.pos = pos.plus(new Vector(0.2, 0.2));
        this.size = new Vector(0.6, 0.6);
        this.speed = new Vector(0, 0);
        this.color = Colors.black;
        this.touched = false;
        this.touchedColor = Colors.red;
        this.hp = 100;
        this.initialSpeed = 6;
        this.speedX = this.initialSpeed;
        this.poisonTimer = 0;

        this.setSprite('player.png', 20);
        this.setAnimation('stand', [0, 1], 120);
        this.setAnimation('attacked', [2, 3], 120);
        this.setAnimation('poisoned', [4, 5], 120);
        this.playAnimation('stand');

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
            this.collidesWithActors(level, [otherActor]);
        }

        if (this.poisonTimer > 0) {
            this.poisonTimer -= 1;
            this.hp -= .04;
            this.playAnimation('poisoned');
        } else if (!this.touched) {
            this.playAnimation('stand');
        } else {
            this.playAnimation('attacked');
        }

        this.touched = false;
        level.playerHp = this.hp;
    }

    moveX(level, keys) {
        this.speed.x = 0;
        if (keys.left) {
            this.speed.x -= this.speedX;
            this.rotation = -1;
        }
        if (keys.right) {
            this.speed.x += this.speedX;
            this.rotation = 1;
        }
        level.updateCamera(this.pos.x);
        const motion = new Vector(this.speed.x * level.step, 0);
        const newPos = this.pos.plus(motion);
        const obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle.type) {
            this.collides(level, obstacle.actors);
            // level.playerTouched(obstacle, this);

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
            this.collides(level, obstacle.actors);

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

    collidesWithActors(level, obstacles) {
        obstacles.forEach(obstacle => {
            switch (obstacle.type) {
                case 'coin':
                    level.actors = level.actors.filter(actor => actor !== obstacle);
                    if (!level.actors.some(actor => {
                        return actor.type === 'coin';
                    })) {
                        level.status = 'win';
                    }
                    break;
                case 'sphere':
                    obstacle.activate(this);
                    break;
                case 'enemy':
                    this.touched = true;
                    this.hp -= obstacle.damage;
                    break;
            }
        });
        if (this.hp <= 0) {
            level.status = 'lost';
        }
    }

    collides(level, obstacles) {
        obstacles.forEach(type => {
            switch (type) {
                case 'lava':
                    this.poisonTimer = 1200;
                    this.touched = true;
                    this.hp -= 1;
                    break;
            }
        });
        if (this.hp <= 0) {
            level.status = 'lost';
        }
    }

    debugDraw(ctx, level) {

    }
}

export default Player;
