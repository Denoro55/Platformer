import Level from "../core/Level";
import Vector from "../helpers/Vector";
import {Colors, Shapes, Types} from "../helpers/types/index";
import DOMDisplay from "../core/Display";

class Actor {
    pos: Vector;
    size: Vector;
    speed: Vector;
    alpha: number;
    collides: boolean;
    animations: {
        [key: string]: {
            frames: number[],
            speed: number
        }
    };
    animationInterval: any;
    currentFrame: number;
    rotation: number;
    image: any;
    spriteSize: number;
    activeAnimation: string;

    type: Types;
    color: Colors;
    shape: Shapes;

    constructor() {
        this.animations = {};
        this.animationInterval = null;
        this.currentFrame = 0;
        this.rotation = 1;
        this.collides = true;
    }

    setSprite(src: string, spriteSize: number) {
        this.image = new Image();
        this.image.src = `./img/actors/${src}`;
        this.spriteSize = spriteSize;
    }

    setAnimation(name: string, frames: number[], speed: number) {
        this.animations[name] = {
            frames, speed
        }
    }

    getCurrentAnimation() {
        return this.activeAnimation;
    }

    playAnimation(name: string) {
        if (this.getCurrentAnimation() === name) return;

        clearTimeout(this.animationInterval);

        const animation = this.animations[name];
        const frames = animation.frames.length;
        this.activeAnimation = name;
        this.currentFrame = animation.frames[(this.currentFrame + 1) % frames];

        this.animationInterval = setInterval(() => {
            this.currentFrame = animation.frames[(this.currentFrame + 1) % frames];
        }, animation.speed);
    }

    changeDirection() {
        this.speed = this.speed.times(-1);
        this.rotation = Math.sign(this.speed.x);
    }

    draw(ctx: any, level: Level, display: DOMDisplay) {
        ctx.globalAlpha = display.getMaxAlpha(this.alpha);
        if (this.rotation > 0) {
            ctx.drawImage(this.image, this.currentFrame * this.spriteSize, 0, this.spriteSize - 1, this.spriteSize, this.pos.x * level.cellSize, this.pos.y * level.cellSize, this.spriteSize, this.spriteSize);
        } else {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.currentFrame * this.spriteSize, 0, this.spriteSize - 1, this.spriteSize, -this.pos.x * level.cellSize - (this.size.x * level.cellSize), this.pos.y * level.cellSize, this.spriteSize, this.spriteSize);
            ctx.restore();
        }
        ctx.globalAlpha = display.getMaxAlpha(1);
    }
}

export default Actor;
