class Actor {
    constructor() {
        this.animations = [];
        this.animationInterval = null;
        this.currentFrame = 0;

        this.rotation = 1;
    }

    setSprite(src, spriteSize) {
        this.image = new Image();
        this.image.src = `/img/actors/${src}`;
        this.spriteSize = spriteSize;
    }

    setAnimation(name, frames, speed) {
        this.animations[name] = {
            frames, speed
        }
    }

    getCurrentAnimation() {
        return this.activeAnimation;
    }

    playAnimation(name) {
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

    draw(ctx, level) {
        if (this.rotation > 0) {
            ctx.drawImage(this.image, this.currentFrame * this.spriteSize, 0, this.spriteSize - 1, this.spriteSize, this.pos.x * level.cellSize, this.pos.y * level.cellSize, this.spriteSize, this.spriteSize);
        } else {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.currentFrame * this.spriteSize, 0, this.spriteSize - 1, this.spriteSize, -this.pos.x * level.cellSize - (this.size.x * level.cellSize), this.pos.y * level.cellSize, this.spriteSize, this.spriteSize);
            ctx.restore();
        }
    }
}

export default Actor;
