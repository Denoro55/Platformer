import Vector from "../helpers/Vector";

class Saw {
    constructor(pos) {
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.color = 'black';
        this.type = 'enemy';
        this.rotation = 0;
    }

    act(level) {
        this.rotation += 4;
    }

    draw(ctx, level) {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        const offset = 0.125;

        const pos = {
            x: this.pos.x + offset,
            y: this.pos.y + offset,
        };

        const size = {
            x: this.size.x - offset * 2,
            y: this.size.y - offset * 2,
        };

        const xx = pos.x * level.size + ((size.x * level.size) / 2);
        const yy = pos.y * level.size + ((size.y * level.size) / 2);

        [(this.rotation) * Math.PI / 180, (this.rotation + 45) * Math.PI / 180].forEach(rot => {
            ctx.translate(xx, yy);
            ctx.rotate(rot);
            ctx.translate(-xx, -yy);
            ctx.rect(pos.x * level.size, pos.y * level.size, size.x * level.size, size.y * level.size);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });

        ctx.fill();
    }
}

export default Saw;
