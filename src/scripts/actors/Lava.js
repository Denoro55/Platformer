import Vector from "../helpers/Vector";

class Lava {
    constructor(pos, type) {
        this.pos = pos;
        this.size = new Vector(1, 1);
        if (type === 'v') {
            this.speed = new Vector(1.3, 0);
        } else {
            this.speed = new Vector(-1.3, 0);
        }
        this.color = 'black';
        this.touched = false;
        this.touchedColor = 'red';
        this.type = 'lava';
    }

    act(level, keys) {
        this.moveX(level, keys);
        this.moveY(level, keys);
    }

    moveX(level) {
        const newPos = this.pos.plus(this.speed.times(level.step));
        const obstacle = level.obstacleAt(newPos, this.size);
        if (!obstacle.type) {
            this.pos = newPos;
        } else {
            this.speed = this.speed.times(-1)
        }
    }

    moveY(level) {
        const dir = this.speed.x > 0 ? 1 : -1;
        const newPos = this.pos.plus(new Vector(this.size.x * dir, this.size.y));
        const obstacle = level.obstacleAt(newPos, this.size);
        if (!obstacle.type) {
            this.speed = this.speed.times(-1);
        }
    }

    draw(ctx, level) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.pos.x * level.size, this.pos.y * level.size, this.size.x * level.size, this.size.y * level.size);
        ctx.fill();
    }
}

export default Lava;
