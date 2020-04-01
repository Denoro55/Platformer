const objectsColor = {
    null: 'transparent',
    'wall': 'black',
    'player': 'blue',
    'coin': 'yellow',
    'lava': 'red'
};

class DOMDisplay {
    constructor(level) {
        this.level = level;
    }

    drawBackground(ctx) {
        const checkSize = this.level.checkSize;
        const size = this.level.size;
        const ylen = this.level.grid.length;
        const xlen = this.level.grid[0].length;

        for (let i = 0; i < ylen; i++) {
            for (let n = 0; n < xlen; n++) {
                const cellType = this.level.grid[i][n];
                ctx.beginPath();
                // ctx.lineWidth = "2";
                // ctx.strokeStyle = objectsColor[cellType];
                ctx.fillStyle = objectsColor[cellType];
                ctx.rect(n * size, i * size, size, size);
                // ctx.stroke();
                ctx.fill();
            }
        }
    }

    drawActors(ctx) {
        this.level.actors.forEach(actor => {
            actor.draw(ctx, this.level);
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
            ctx.moveTo(checkSize, checkSize);
            ctx.lineTo(checkSize * 2, checkSize * 2);
            ctx.moveTo(checkSize * 2, checkSize);
            ctx.lineTo(checkSize, checkSize * 2);
            ctx.stroke();
        } else if (this.level.status === 'win') {
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = '#33f526';
            ctx.beginPath();
            ctx.moveTo(checkSize * 2, checkSize);
            ctx.lineTo(checkSize + 5, checkSize * 2 - 5);
            ctx.lineTo(checkSize , checkSize * 2 - 10);
            ctx.stroke();
        }
    }

    drawFrame(game) {
        const ctx = this.level.ctx;
        this.drawActors(ctx);
        this.drawBackground(ctx);
        this.drawCheck(ctx);
    }
}

export default DOMDisplay;
