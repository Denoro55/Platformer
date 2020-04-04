import Vector from "../helpers/Vector";
import {Types, Shapes, Colors} from "../helpers/types/index";
import Level from "../core/Level";

class Saw {
    pos: Vector;
    size: Vector;
    rotation: number;
    type: Types;
    color: Colors;
    shape: Shapes;
    damage: number;

    constructor(pos: Vector) {
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.rotation = 0;

        this.color = Colors.black;
        this.shape = Shapes.circle;
        this.type = Types.enemy;
        this.damage = 1;
    }

    act(level: Level) {
        this.rotation += 4;
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

        [(this.rotation) * Math.PI / 180, (this.rotation + 45) * Math.PI / 180].forEach(rot => {
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
