import Vector from "../helpers/Vector";
import Shapes from "../helpers/types/Shapes";
import {getRandomPoint} from '../helpers/functions';
import Effect from "./Effect";

export default class extends Effect {
    constructor(params) {
        super(params);
        this.shape = Shapes.square;
        this.alpha = 0;
        this.sign = 0;
        this.rotation = params.rotation || 0;
        this.startPos = this.pos;
        this.delay = params.delay;
        this.type = 'star';
    }

    update(level) {
        if (this.delay > 0) {
            this.delay -= 1;
        } else {
            this.rotation += 4;
            const sin = Math.sin(this.rotation / 100);
            this.alpha = Math.abs(sin);
            const newSign = Math.sign(sin);
            this.size = new Vector(this.alpha * .16, this.alpha * .16);
            this.pos = new Vector(this.startPos.x - this.alpha * .08, this.startPos.y - this.alpha * .08);
            const viewParams = level.getViewParams();
            if (Math.sign(sin) !== this.sign) {
                this.startPos = getRandomPoint(viewParams.x[0] + level.canvasWidth / level.cellSize, level.canvasHeight / level.cellSize - 4);
            }
            this.sign = newSign;
        }
    }
}
