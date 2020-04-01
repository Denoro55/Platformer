import Vector from "../helpers/Vector";
import Colors from "../helpers/Colors";

export default class {
    constructor({pos, speed, size, color, name, strokeWidth, style, alpha}) {
        this.pos = pos;
        this.speed = speed || new Vector(0, 0);
        this.size = size || new Vector(1, 1);
        this.color = color || Colors.blue;
        this.name = name || '';
        this.alpha = alpha !== undefined ? alpha : 1;
        this.options = {
            strokeWidth: strokeWidth || 2,
            style: style || 'stroke'
        }
    }

    act(level) {

    }
}
