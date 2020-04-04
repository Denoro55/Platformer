import Vector from "../helpers/Vector";
import {Colors} from "../helpers/types/index";

class Params {
    pos: Vector;
    size: Vector;
    color: Colors;
}

export default class extends Params {
    constructor(params: Params) {
        super();
        this.pos = params.pos;
        this.size = params.size;
        this.color = params.color;
    }
}
