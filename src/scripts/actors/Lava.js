import Vector from "../helpers/Vector";
import Shapes from "../helpers/types/Shapes";
import Colors from "../helpers/types/Colors";
import Types from "../helpers/types/Types";
import Actor from "./Actor";

class Lava extends Actor {
    constructor(pos, type) {
        super();
        this.pos = pos;
        this.size = new Vector(1, 1);
        if (type === 'v') {
            this.speed = new Vector(1.3, 0);
        } else {
            this.speed = new Vector(1.3, 0);
        }

        this.damage = 1;
        this.type = Types.enemy;
        this.shape = Shapes.square;
        this.color = Colors.black;

        this.setSprite('enemy.png', 32);
        this.setAnimation('stand', [0, 1], 120);
        this.playAnimation('stand');
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
            this.changeDirection();
        }
    }

    moveY(level) {
        const dir = this.speed.x > 0 ? 1 : -1;
        const newPos = this.pos.plus(new Vector(this.size.x * dir, this.size.y));
        const obstacle = level.obstacleAt(newPos, this.size);
        if (!obstacle.type) {
            this.changeDirection();
        }
    }

    changeDirection() {
        this.speed = this.speed.times(-1);
        this.rotation = Math.sign(this.speed.x);
    }

    // draw(ctx, level) {
    //     if (this.speed.x > 0) {
    //         ctx.drawImage(this.image, this.pos.x * level.cellSize, this.pos.y * level.cellSize);
    //     } else {
    //         ctx.save();
    //         ctx.scale(-1, 1);
    //         ctx.drawImage(this.image, -this.pos.x * level.cellSize - (this.size.x * level.cellSize), this.pos.y * level.cellSize);
    //         ctx.restore();
    //     }
    // }

    debugDraw(ctx, level) {
        // ctx.beginPath();
        // ctx.globalAlpha = 0.3;
        // ctx.fillStyle = Colors.debug;
        // ctx.rect(this.pos.x * level.cellSize, this.pos.y * level.cellSize, this.size.x * level.cellSize, this.size.y * level.cellSize);
        // ctx.fill();
        // ctx.globalAlpha = 1;
    }
}

export default Lava;
