import Vector from "../helpers/Vector";
import Shapes from "../helpers/Shapes";
import Colors from "../helpers/Colors";
import Types from "../helpers/Types";

class Saw {
    constructor(pos) {
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.rotation = 0;

        this.color = Colors.black;
        this.shape = Shapes.circle;
        this.type = Types.enemy;
        this.damage = 1;
    }

    act(level) {
        this.rotation += 4;
    }

    draw(ctx, level) {
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

        const xx = pos.x * level.size + ((size.x * level.size) / 2);
        const yy = pos.y * level.size + ((size.y * level.size) / 2);

        [(this.rotation) * Math.PI / 180, (this.rotation + 45) * Math.PI / 180].forEach(rot => {
            ctx.save();
            ctx.translate(xx, yy);
            ctx.rotate(rot);
            ctx.translate(-xx, -yy);
            ctx.rect(pos.x * level.size, pos.y * level.size, size.x * level.size, size.y * level.size);
            ctx.fill();
            ctx.restore();
            // ctx.setTransform(1, 0, 0, 1, 0, 0);
        });
    }

    debugDraw(ctx, level) {
        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = Colors.debug;
        ctx.arc((this.pos.x + .5) * level.size, (this.pos.y + .5) * level.size,  (this.size.x * level.size) / 2, 0, 2 * Math.PI);
        // ctx.rect((this.pos.x - .5) * level.size, (this.pos.y - .5) * level.size, this.size.x * level.size, this.size.y * level.size);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

export default Saw;
