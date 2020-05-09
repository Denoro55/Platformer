import Level from "./Level";
import Game from "../states/Game";

import tilesFromMap from "../map/tilesFromMap";

const parsedTilesFromMap: any = Object.values(tilesFromMap).reduce((acc: object, {name, color, draw}) => {
    return {...acc, [name]: {
            color,
            draw
        }};
}, {});

class DOMDisplay {
    level: Level;
    alpha: number;
    bg: any;
    tile: any;
    cameraX: number;

    constructor(level: Level) {
        this.level = level;
        this.alpha = 1;
        this.bg = new Image();
        this.bg.src = './img/bg/4.jpg';
        this.tile = new Image();
        this.tile.src = './img/tile.png';
        this.cameraX = 0;
    }

    getMaxAlpha(alpha: number) {
        return Math.min(alpha, this.alpha);
    }

    drawBackground(ctx: any) {
        const size = this.level.cellSize;
        const yLen = this.level.grid.length;
        // const xLen = this.level.grid[0].length;

        // let count = 0;

        const viewParams = this.level.currentCamera;

        this.level.firstLayer.forEach((tile: any) => {
            const currentTile = parsedTilesFromMap[tile.name];
            ctx.beginPath();
            ctx.fillStyle = currentTile.color;
            currentTile.draw(ctx, this, {size, x: tile.x, y: tile.y, layer: -1});
        });

        for (let i = 0; i < yLen; i++) {
            // for (let n = 0; n < xLen; n++) {
            for (let n = viewParams[0]; n < viewParams[1]; n++) {
                const cellType = this.level.grid[i][n];
                const tile = parsedTilesFromMap[cellType];
                ctx.beginPath();
                ctx.fillStyle = tile.color;
                tile.draw(ctx, this, {size, x: n, y: i, layer: 0});
                // switch (cellType) {
                //     case 'wall':
                //         ctx.drawImage(this.tile, n * size - 2, i * size - 2);
                //         break;
                //     case 'wall_ghost':
                //         ctx.drawImage(this.tile, n * size - 2, i * size - 2);
                //         break;
                // }
                // count ++;
                // ctx.rect(n * size, i * size, size, size);
                // if (cellType === 'lava') {
                //     ctx.rect(n * size, i * size, size, size);
                // } else if (cellType === 'wall') {
                //     ctx.drawImage(this.tile, n * size - 2, i * size - 2);
                // }
                ctx.fill();
            }
        }
        // console.log(count);
    }

    drawActors(ctx: any) {
        this.level.actors.forEach(actor => {
            if (this.level.debug) {
                actor.debugDraw(ctx, this.level);
            } else if (this.level.inCamera(actor.pos.x)) {
                actor.draw(ctx, this.level, this);
            }
            actor.touched = false;
        })
    }

    drawCheck(ctx: any) {
        const checkSize = this.level.checkSize;

        if (this.level.status !== 'win') {
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

    drawHealthBar(ctx: any) {
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

    drawEffects(ctx: any) {
        this.level.effects.forEach(effect => {
            effect.draw(ctx, this.level, this);
        })
    };

    drawText(ctx: any, currentLevel: number) {
        ctx.font = "14px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Уровень " + currentLevel, 450 - this.level.cameraX, 40);

        ctx.textAlign = "left";
        ctx.font = "12px Arial";
        const offsetY = 18;
        const helpers = ["Управление ←, →, ↑, ↓", 'Z - ускорение', '+ двойной прыжок', 'Сферы дают доп. прыжок'];
        helpers.forEach((helper, idx) => {
            ctx.fillText(helper, 15 - this.level.cameraX, 55 + offsetY * idx);
        });
    }

    drawFrame(game: Game) {
        const ctx = this.level.ctx;

        if (this.level.timeNextLevel >= 0) {
            this.alpha = this.level.timeNextLevel / 100;
        } else {
            this.alpha = 1;
        }

        ctx.globalAlpha = this.alpha;
        ctx.save();
        ctx.translate(this.level.cameraX, 0);

        ctx.drawImage(this.bg, -this.level.cameraX, 0);
        this.drawEffects(ctx);
        this.drawActors(ctx);
        this.drawBackground(ctx);
        this.drawCheck(ctx);
        this.drawHealthBar(ctx);
        this.drawText(ctx, game.currentLevel);

        ctx.restore();
    }
}

export default DOMDisplay;
