import Vector from "../helpers/Vector";
import {Shapes} from "../helpers/types/index";
import {getRandomPoint} from '../helpers/functions';
import Effect from "./Effect";
import Level from "../core/Level";
import DOMDisplay from "../core/Display";

export default class extends Effect {
    shape: Shapes;
    sign: number;
    rotation: number;
    startPos: Vector;
    delay: number;
    type: string;
    alpha: number;

    constructor(params: any) {
        super(params);
        this.shape = Shapes.square;
        this.alpha = 0;
        this.sign = 0;
        this.rotation = params.rotation || 0;
        this.startPos = this.pos;
        this.delay = params.delay;
        this.type = 'star';
    }

    update(level: Level) {
        if (this.delay > 0) {
            this.delay -= 1;
        } else {
            this.rotation += 4;
            const sin = Math.sin(this.rotation / 100);
            this.alpha = Math.abs(sin);
            const newSign = Math.sign(sin);
            this.size = new Vector(this.alpha * .16, this.alpha * .16);
            this.pos = new Vector(this.startPos.x - this.alpha * .08, this.startPos.y - this.alpha * .08);
            const viewParams = level.currentCamera;
            if (Math.sign(sin) !== this.sign) {
                this.startPos = getRandomPoint(viewParams[0] + level.canvasWidth / level.cellSize, level.canvasHeight / level.cellSize - 4);
            }
            this.sign = newSign;
        }
    }

    draw(ctx: any, level: Level, display: DOMDisplay) {
        ctx.globalAlpha = display.getMaxAlpha(this.alpha);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.save();
        const offsetX = this.pos.x * level.cellSize + ((this.size.x * level.cellSize) / 2);
        const offsetY = this.pos.y * level.cellSize + ((this.size.y * level.cellSize) / 2);
        ctx.translate(offsetX, offsetY);
        ctx.rotate(this.rotation * Math.PI / 180); // rotate around the start point of your line
        ctx.translate(-offsetX, -offsetY);
        ctx.fillRect(this.pos.x * level.cellSize, this.pos.y * level.cellSize, this.size.x * level.cellSize, this.size.y * level.cellSize);
        ctx.restore();
        ctx.globalAlpha = display.alpha;
    }
}
