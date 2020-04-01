import Vector from "../helpers/Vector";

class Coin {
    constructor(pos) {
        this.pos = this.basePos = pos.plus(new Vector(0.25, 0.55));
        this.size = new Vector(0.5, 0.5);
        this.speed = new Vector(0, 0);
        this.wobble = Math.random() * Math.PI * 2;
        this.color = 'yellow';
        this.touched = false;
        this.touchedColor = 'red';
        this.type = 'coin';
    }

    act(level) {
        this.wobble += level.step * 7;
        const wobblePos = Math.sin(this.wobble) * 0.1;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));
    }

    draw(ctx, level) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x * level.size, this.pos.y * level.size, this.size.x * level.size, this.size.y * level.size);
        ctx.fill();
    }
}

export default Coin;
