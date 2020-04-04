import Vector from "../helpers/Vector";
import {Types, Shapes, Colors} from "../helpers/types/index";
import Actor from "./Actor";
import Level from "../core/Level";
import {Obstacle} from "../interfaces/index";

class Lava extends Actor {
    damage: number;

    constructor(pos: Vector) {
        super();
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.speed = new Vector(1.3, 0);
        this.damage = 1;
        this.type = Types.enemy;
        this.shape = Shapes.square;
        this.color = Colors.black;

        this.setSprite('enemy.png', 32);
        this.setAnimation('stand', [0, 1], 120);
        this.playAnimation('stand');
    }

    act(level: Level) {
        this.moveX(level);
        this.moveY(level);
    }

    moveX(level: Level) {
        const newPos = this.pos.plus(this.speed.times(level.step));
        const obstacle: Obstacle = level.obstacleAt(newPos, this.size);
        if (!obstacle.type) {
            this.pos = newPos;
        } else {
            this.changeDirection();
        }
    }

    moveY(level: Level) {
        const dir = this.speed.x > 0 ? 1 : -1;
        const newPos = this.pos.plus(new Vector(this.size.x * dir, this.size.y));
        const obstacle: Obstacle = level.obstacleAt(newPos, this.size);
        if (!obstacle.type) {
            this.changeDirection();
        }
    }

    debugDraw(ctx: any, level: Level) {

    }
}

export default Lava;
