import Actor from "./Actor";
import Level from "../core/Level";
import Vector from "../helpers/Vector";
import {Shapes, Types} from "../helpers/types/index";

class SpiritWall extends Actor {
    shape: Shapes;
    type: Types;
    collisions: boolean;
    timer: number;
    startTime: number;

    constructor(pos: Vector, params: any) {
        super();
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.shape = Shapes.square;
        this.setSprite('spirit-wall.png', 36);
        this.type = Types.spiritWall;
        this.collisions = true;
        this.alpha = .2;
        this.startTime = 300;
        this.timer = this.getProperty(params,'startTimer', 2) * 150;
    }

    act(level: Level) {
        if (this.timer > 0) {
            if (this.timer < 150) {
                this.collisions = false;
                this.collides = false;
            } else {
                this.alpha = (this.timer - 150) / 150;
            }
            this.timer -= 1;
        } else {
            this.collisions = true;
            this.collides = true;
            this.timer = this.startTime;
        }
    }
}

export default SpiritWall;

