import {Colors} from "../helpers/types/index";
import Level from "../core/Level";
import DOMDisplay from "../core/Display";
import Effect from "./Effect";

export default class extends Effect {
    endTimer: number;
    timer: number;
    alpha: number;
    type: string;
    offsetX: number;

    constructor(params: any) {
        super(params);
        this.endTimer = 80 + Math.random() * 70;
        this.timer = Math.random() * 50;
        this.color = Colors.lava;
        this.randomizeOffset();
        this.alpha = 1;
        this.type = 'bubble';
        this.offsetX = 0;
    }

    update() {
        if (this.timer < this.endTimer + 30) {
            this.timer += 4;
            if (this.timer > this.endTimer) {
                this.alpha -= 0.1;
            }
        } else {
            this.timer = 0;
            this.endTimer = 100 + Math.random() * 100;
            this.alpha = 1;
            this.randomizeOffset();
        }
    }

    randomizeOffset() {
        this.offsetX = - .3 + Math.random() * .6;
    }

    draw(ctx: any, level: Level, display: DOMDisplay) {
        if (level.inCamera(this.pos.x)) {
            ctx.globalAlpha = display.getMaxAlpha(this.alpha);
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc((this.pos.x + .5 + this.offsetX) * level.cellSize, (this.pos.y) * level.cellSize, this.timer / 30, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = display.alpha;
        }
    }
}
