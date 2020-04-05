import Vector from "../helpers/Vector";
import {Types, Shapes, Colors} from "../helpers/types/index";
import Level from "../core/Level";
import Actor from "./Actor";

class Saw extends Actor {
    damage: number;
    angle: number;

    // params
    axis: 'x' | 'y';
    direction: number; // 1, -1
    currentPosition: number; // 1 cell = 2
    range: number; // 1 cell = 2

    constructor(pos: Vector, params: any) {
        super();
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.color = Colors.black;
        this.shape = Shapes.circle;
        this.type = Types.enemy;
        this.damage = 1;
        this.angle = 1;

        this.direction = this.getProperty(params, 'direction', 1);
        this.speed = new Vector(this.getProperty(params, 'speedX', 0) * this.direction, this.getProperty(params, 'speedY', 0) * this.direction);
        this.currentPosition = this.getProperty(params, 'currentPosition', 2) / 2;
        this.range = this.getProperty(params, 'range', 4) / 2;
        this.axis = this.getProperty(params, 'axis', 'x');
    }

    act(level: Level) {
        this.angle += 4;
        this.currentPosition += Math.abs(this.speed[this.axis] * level.step);

        let newPos: Vector;
        if (this.axis === 'x') {
            newPos = this.pos.plus(new Vector(this.speed.x * level.step, 0));
        } else {
            newPos = this.pos.plus(new Vector(0, this.speed.y * level.step));
        }

        this.pos = newPos;

        if (this.currentPosition >= this.range) {
            this.changeDirection();
            this.currentPosition = 0;
        }
    }

    draw(ctx: any, level: Level) {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        const decreaseSize = .25;
        const offset = -0.5 * (this.size.x - 1);

        const pos = {
            x: (this.pos.x + offset)+ (decreaseSize / 2),
            y: (this.pos.y + offset) + (decreaseSize / 2),
        };

        const size = {
            x: this.size.x - decreaseSize,
            y: this.size.y - decreaseSize,
        };

        const xx = pos.x * level.cellSize + ((size.x * level.cellSize) / 2);
        const yy = pos.y * level.cellSize + ((size.y * level.cellSize) / 2);

        [(this.angle) * Math.PI / 180, (this.angle + 45) * Math.PI / 180].forEach(rot => {
            ctx.save();
            ctx.translate(xx, yy);
            ctx.rotate(rot);
            ctx.translate(-xx, -yy);
            ctx.rect(pos.x * level.cellSize, pos.y * level.cellSize, size.x * level.cellSize, size.y * level.cellSize);
            ctx.fill();
            ctx.restore();
        });
    }

    debugDraw(ctx: any, level: Level) {
        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = Colors.debug;
        ctx.arc((this.pos.x + .5) * level.cellSize, (this.pos.y + .5) * level.cellSize,  (this.size.x * level.cellSize) / 2, 0, 2 * Math.PI);
        // ctx.rect((this.pos.x - .5) * level.cellSize, (this.pos.y - .5) * level.cellSize, this.size.x * level.cellSize, this.size.y * level.cellSize);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

export default Saw;
