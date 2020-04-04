import Vector from "../helpers/Vector";
import Actor from "./Actor";
import {Colors} from "../helpers/types/index";
import {Codes, Obstacle} from "../interfaces/index";
import Level from "../core/Level";
import {Statuses} from "../enums/index";

class Player extends Actor {
    speed: Vector;
    color: Colors;
    touched: boolean;
    lustiness: number;
    initialSpeed: number;
    speedX: number;
    poisonTimer: number;
    initialOptions: {
        jumpEnergy: number
    };
    gravity: number;
    jumped: boolean;
    jumpForce: number;
    jumpsCount: number;
    jumpEnergy: number;

    constructor(pos: Vector) {
        super();
        this.pos = pos.plus(new Vector(0.2, 0.2));
        this.size = new Vector(0.6, 0.6);
        this.speed = new Vector(0, 0);
        this.color = Colors.black;
        this.touched = false;
        this.lustiness = 100;
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

    act(level: Level, keys: Codes) {
        if (keys.z) {
            this.speedX = this.initialSpeed + 1;
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
            this.lustiness -= .04;
            this.playAnimation('poisoned');
        } else if (!this.touched) {
            this.playAnimation('stand');
        } else {
            this.playAnimation('attacked');
        }

        this.touched = false;
        level.playerHp = this.lustiness;
    }

    moveX(level: Level, keys: Codes) {
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

        if (this.pos.x > level.cellsX - 1 && level.status === Statuses.coins) {
            level.status = Statuses.animation;
            level.timeNextLevel = 100;
        }

        const motion = new Vector(this.speed.x * level.step, 0);
        const newPos = this.pos.plus(motion);
        const obstacle: Obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle.type) {
            this.collides(level, obstacle.actors);

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

    moveY(level: Level, keys: Codes) {
        this.speed.y += level.step * this.gravity;
        const motion = new Vector(0, this.speed.y * level.step);
        const newPos = this.pos.plus(motion);

        if (newPos.y + this.size.y > level.cellsY - .5) {
            level.status = Statuses.lost;
        }

        if (!keys.up && this.jumped) {
            this.jumpEnergy = 0;
            this.jumped = false;
            this.jumpsCount -= 1;
        }

        const obstacle: Obstacle = level.obstacleAt(newPos, this.size);
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

    collidesWithActors(level: Level, obstacles: any[]) {
        obstacles.forEach(obstacle => {
            switch (obstacle.type) {
                case 'coin':
                    level.actors = level.actors.filter(actor => actor !== obstacle);
                    if (!level.actors.some(actor => {
                        return actor.type === 'coin';
                    })) {
                        level.status = Statuses.coins;
                    }
                    break;
                case 'sphere':
                    obstacle.activate(this);
                    break;
                case 'enemy':
                    this.touched = true;
                    this.lustiness -= obstacle.damage;
                    break;
            }
        });
        if (this.lustiness <= 0) {
            level.status = Statuses.lost;
        }
    }

    collides(level: Level, obstacles: any) {
        obstacles.forEach((type: string) => {
            switch (type) {
                case 'lava':
                    this.poisonTimer = 1200;
                    this.touched = true;
                    this.lustiness -= 1;
                    break;
            }
        });
        if (this.lustiness <= 0) {
            level.status = Statuses.lost;
        }
    }

    debugDraw(ctx: any, level: Level) {

    }
}

export default Player;
