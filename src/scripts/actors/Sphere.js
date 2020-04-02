import Vector from "../helpers/Vector";
import Shapes from "../helpers/types/Shapes";
import Colors from "../helpers/types/Colors";
import Types from "../helpers/types/Types";

class Sphere {
    constructor(pos) {
        this.pos = this.basePos = pos.plus(new Vector(0, 0.35));
        this.size = new Vector(0.25, 0.25);
        this.wobble = Math.random() * Math.PI * 2;
        this.reloadTime = 150;
        this.timer = -1;

        this.type = Types.sphere;
        this.color = Colors.sphere;
        this.shape = Shapes.circle;
    }

    act(level) {
        this.wobble += level.step * 7;
        const wobblePos = Math.sin(this.wobble) * 0.1;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));

        if (this.timer > -1) {
            this.timer -= 1;
        }
    }

    activate(player) {
        if (this.timer !== -1) return;
        player.jumpsCount += 1;
        this.timer = this.reloadTime;
    }

    draw(ctx, level) {
        ctx.globalAlpha = this.timer === -1 ? 1 : 0;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc((this.pos.x + .5) * level.cellSize, (this.pos.y + .5) * level.cellSize, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    debugDraw(ctx, level) {

    }
}

export default Sphere;
