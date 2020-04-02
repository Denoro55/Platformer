import Vector from "../helpers/Vector";
import Shapes from "../helpers/types/Shapes";
import Colors from "../helpers/types/Colors";
import Types from "../helpers/types/Types";

class Coin {
    constructor(pos) {
        this.pos = this.basePos = pos.plus(new Vector(0.25, 0.55));
        this.size = new Vector(0.5, 0.5);
        this.wobble = Math.random() * Math.PI * 2;

        this.type = Types.coin;
        this.color = Colors.yellow;
        this.shape = Shapes.square;
    }

    act(level) {
        this.wobble += level.step * 7;
        const wobblePos = Math.sin(this.wobble) * 0.1;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));
    }

    draw(ctx, level) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x * level.cellSize, this.pos.y * level.cellSize, this.size.x * level.cellSize, this.size.y * level.cellSize);
        ctx.fill();
    }

    debugDraw(ctx, level) {

    }
}

export default Coin;
