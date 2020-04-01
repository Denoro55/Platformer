import Vector from "../helpers/Vector";

class Sphere {
    constructor(pos) {
        this.pos = this.basePos = pos.plus(new Vector(0, 0.55));
        this.size = new Vector(0.25, 0.25);
        this.wobble = Math.random() * Math.PI * 2;
        this.color = '#28ecec';
        this.type = 'sphere';
        this.reloadTime = 150;
        this.timer = -1;
    }

    act(level) {
        this.wobble += level.step * 7;
        const wobblePos = Math.sin(this.wobble) * 0.1;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));

        if (this.timer > -1) {
            this.timer -= 1;
        }
    }

    activate(player) {
        console.log(player)
        if (this.timer !== -1) return;
        player.jumpsCount += 1;
        this.timer = this.reloadTime;
    }

    draw(ctx, level) {
        ctx.globalAlpha = this.timer === -1 ? 1 : 0;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc((this.pos.x + this.size.x / 2) * level.size, (this.pos.y + this.size.y / 2) * level.size, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

export default Sphere;
