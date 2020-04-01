const objectsColor = {
    null: 'transparent',
    'wall': 'black',
    'lava': '#1cec82'
};

class DOMDisplay {
    constructor(level) {
        this.level = level;
        this.bg = new Image();
        this.bg.src = '/img/bg/4.jpg';
        this.tile = new Image();
        this.tile.src = '/img/tile.png';
        this.cameraX = 0;
    }

    drawBackground(ctx) {
        const size = this.level.size;
        const yLen = this.level.grid.length;
        const xLen = this.level.grid[0].length;

        for (let i = 0; i < yLen; i++) {
            for (let n = 0; n < xLen; n++) {
                const cellType = this.level.grid[i][n];
                ctx.beginPath();
                ctx.fillStyle = objectsColor[cellType];
                // ctx.rect(n * size, i * size, size, size);
                if (cellType === 'lava') {
                    ctx.rect(n * size, i * size, size, size);
                } else if (cellType === 'wall') {
                    ctx.drawImage(this.tile, n * size - 2, i * size - 2);
                }
                ctx.fill();
            }
        }
    }

    drawActors(ctx) {
        this.level.actors.forEach(actor => {
            actor.draw(ctx, this.level);
            if (this.level.debug) {
                actor.debugDraw(ctx, this.level);
            }
            actor.touched = false;
        })
    }

    drawCheck(ctx) {
        const checkSize = this.level.checkSize;

        if (!this.level.status) {
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(checkSize - this.level.cameraX, checkSize);
            ctx.lineTo(checkSize * 2 - this.level.cameraX, checkSize * 2);
            ctx.moveTo(checkSize * 2 - this.level.cameraX, checkSize);
            ctx.lineTo(checkSize - this.level.cameraX, checkSize * 2);
            ctx.stroke();
        } else if (this.level.status === 'win') {
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = '#33f526';
            ctx.beginPath();
            ctx.moveTo(checkSize * 2 - this.level.cameraX, checkSize);
            ctx.lineTo(checkSize + 5 - this.level.cameraX, checkSize * 2 - 5);
            ctx.lineTo(checkSize - this.level.cameraX, checkSize * 2 - 10);
            ctx.stroke();
        }
    }

    drawHealthBar(ctx) {
        const maxHp = 100;

        const x = 50,
              y = 18,
              width = Math.max(0, this.level.playerHp * 100 / maxHp);

        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.rect(x + 1 - this.level.cameraX, y + 1, width - 2, 6);
        ctx.fill();

        ctx.lineWidth = "1";
        ctx.strokeStyle = '#fff';
        ctx.rect(x - this.level.cameraX, y, 100, 8);
        ctx.stroke();
    }

    drawEffects(ctx) {
        this.level.effects.forEach(effect => {
            ctx.beginPath();
            if (effect.options && effect.options.style === 'stroke') {
                ctx.lineWidth = effect.options.strokeWidth || 2;
                ctx.strokeStyle = effect.color;
            } else {
                ctx.fillStyle = effect.color;
            }
            switch (effect.type) {
                case 'star':
                    if (effect.options.style === 'stroke') {
                        ctx.rect(effect.pos.x * this.level.size, effect.pos.y * this.level.size, effect.size.x * this.level.size, effect.size.y * this.level.size);
                        ctx.stroke();
                    } else {
                        ctx.save();
                        ctx.globalAlpha = effect.alpha;
                        const offsetX = effect.pos.x * this.level.size + ((effect.size.x * this.level.size) / 2);
                        const offsetY = effect.pos.y* this.level.size + ((effect.size.y * this.level.size) / 2);
                        ctx.translate(offsetX, offsetY);
                        ctx.rotate(effect.rotation * Math.PI / 180); // rotate around the start point of your line
                        ctx.translate(-offsetX, -offsetY);
                        ctx.fillRect(effect.pos.x * this.level.size, effect.pos.y * this.level.size, effect.size.x * this.level.size, effect.size.y * this.level.size);
                        ctx.restore();
                    }
                    break;
                case 'bubble':
                    ctx.globalAlpha = effect.alpha;
                    ctx.beginPath();
                    ctx.fillStyle = effect.color;
                    ctx.arc((effect.pos.x + .5 + effect.offsetX) * this.level.size, (effect.pos.y) * this.level.size, effect.timer / 30, 0, 2 * Math.PI);
                    ctx.fill();
                    break;
            }
            ctx.globalAlpha = 1;
        })
    };

    drawText(ctx) {
        ctx.font = "14px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Тестовая площадка", 450 - this.level.cameraX, 55);

        ctx.textAlign = "left";
        ctx.font = "12px Arial";
        const offsetY = 18;
        const helpers = ["Управление ←, →, ↑, ↓", 'Z - ускорение', '+ двойной прыжок', 'Сферы дают доп. прыжок'];
        helpers.forEach((helper, idx) => {
            ctx.fillText(helper, 15 - this.level.cameraX, 55 + offsetY * idx);
        });
    }

    drawFrame(game) {
        const ctx = this.level.ctx;
        ctx.save();
        ctx.translate(this.level.cameraX, 0);
        ctx.drawImage(this.bg, -this.level.cameraX, 0);
        this.drawEffects(ctx);
        this.drawActors(ctx);
        this.drawBackground(ctx);
        this.drawCheck(ctx);
        this.drawHealthBar(ctx);
        this.drawText(ctx);

        ctx.restore();
    }
}

export default DOMDisplay;
