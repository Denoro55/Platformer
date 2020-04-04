import Vector from "../helpers/Vector";
import {Types, Shapes, Colors} from "../helpers/types/index";
import Player from "./Player";
import DOMDisplay from "../core/Display";
import Level from "../core/Level";

class Sphere {
    pos: Vector;
    basePos: Vector;
    size: Vector;
    wobble: number;
    reloadTime: number;
    timer: number;
    type: Types;
    color: Colors;
    shape: Shapes;

    constructor(pos: Vector) {
        this.pos = this.basePos = pos.plus(new Vector(0, 0.35));
        this.size = new Vector(0.25, 0.25);
        this.wobble = Math.random() * Math.PI * 2;
        this.reloadTime = 150;
        this.timer = -1;

        this.type = Types.sphere;
        this.color = Colors.sphere;
        this.shape = Shapes.circle;
    }

    act(level: Level) {
        this.wobble += level.step * 7;
        const wobblePos = Math.sin(this.wobble) * 0.1;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));

        if (this.timer > -1) {
            this.timer -= 1;
        }
    }

    activate(player: Player) {
        if (this.timer !== -1) return;
        player.jumpsCount += 1;
        this.timer = this.reloadTime;
    }

    draw(ctx: any, level: Level, display: DOMDisplay) {
        const alpha = this.timer === -1 ? 1 : 0;
        ctx.globalAlpha = display.getMaxAlpha(alpha);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc((this.pos.x + .5) * level.cellSize, (this.pos.y + .5) * level.cellSize, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = display.getMaxAlpha(1);
    }

    debugDraw(ctx: any, level: Level) {

    }
}

export default Sphere;
