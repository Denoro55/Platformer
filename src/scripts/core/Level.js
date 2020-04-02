import Player from '../actors/Player';
import Coin from "../actors/Coin";
import Lava from "../actors/Lava";
import Sphere from "../actors/Sphere";
import Saw from "../actors/Saw";
import Vector from "../helpers/Vector";
import Star from "../effects/Star";
import {getRandomPoint, clamp} from "../helpers/functions";
import Colors from "../helpers/types/Colors";
import Bubble from "../effects/Bubble";

const objectsFromMap = {
    0:  null,
    1: 'wall',
    2: 'lava'
};

const actors = {
    2: Lava,
    3: Player,
    4: Sphere,
    5: Coin,
    6: Saw,
};

class Level {
    constructor(game, currentMap) {
        const mapTiles = currentMap.tiles;
        this.debug = game.config.debug;

        this.ctx = game.ctx;
        this.canvasWidth = game.gameWidth;
        this.canvasHeight = game.gameHeight;
        this.cellsX = mapTiles[0].length;
        this.cellsY = mapTiles.length;
        this.firstLayer = [];
        this.grid = [];
        this.actors = [];
        this.effects = [];

        this.playerHp = 0;
        this.cameraX = 0;

        // params
        this.cellSize = 32;
        this.step = 0.016;

        // size of check (game status)
        this.checkSize = 15;

        for (let i = 0; i < this.cellsY; i++) {
            let gridLine = [];
            for (let n = 0; n < this.cellsX; n++) {
                const currentCell = mapTiles[i][n];
                let objectType = objectsFromMap[currentCell] || null;

                // create bubbles and add lava to first layer
                if (objectType === 'lava') {
                    this.firstLayer.push({
                        name: 'lava',
                        x: n,
                        y: i
                    });
                    this.effects.push(new Bubble({
                        pos: new Vector(n, i)
                    }));
                }
                gridLine.push(objectType)
            }
            this.grid.push(gridLine);
        }

        currentMap.actors.forEach(actor => {
            const Actor = actors[actor.gid];

            const x = (actor.x / this.cellSize);
            const y = (actor.y / this.cellSize) - 1;

            this.actors.push(new Actor(new Vector(x, y), 0));
        });

        // stars
        for (let i = 0; i < 20; i++) {
            this.effects.push(new Star({
                pos: getRandomPoint(this.cellsX, this.cellsY),
                size: new Vector(0, 0),
                color: Colors.white,
                strokeWidth: 1,
                rotation: 0,
                delay: Math.random() * 60,
                style: 'fill'
            }))
        }
    }

    animate(arrows) {
        this.actors.forEach(actor => {
            actor.act(this, arrows);
        });
        this.effects.forEach(effect => {
            effect.act(this);
            effect.update(this);
        })
    }

    obstacleAt(pos, actorSize) {
        const startX = Math.floor(pos.x);
        const endX = Math.ceil(pos.x + actorSize.x);
        const startY = Math.floor(pos.y);
        const endY = Math.ceil(pos.y + actorSize.y);

        let result = {
            actors: [],
            pos: {}
        };

        const collider = {
            type: 'wall',
            actors: ['wall']
        };

        // выход за карту (столкновение)
        if (startX < 0) {
            collider.pos = {
                x: -1,
                y: this.cellsY
            };
            return collider;
        } else if (endX > this.cellsX) {
            collider.pos = {
                x: this.cellsX,
                y: this.cellsY
            };
            return collider;
        }

        for (let i = startY; i < endY; i++) {
            for (let n = startX; n < endX; n++) {
                const cellType = this.grid[i][n];
                if (cellType) {
                    result.actors.push(this.grid[i][n]);
                    if (!result.type) {
                        result.type = cellType;
                        result.pos.x = n;
                        result.pos.y = i;
                    }
                }
            }
        }

        return result;
    }

    actorAt(actor) {
        const cellSize = this.cellSize;

        for (let i = 0; i < this.actors.length; i++) {
            const other = this.actors[i];

            switch (other.shape) {
                case 'square':
                    // square to square
                    if (other !== actor &&
                        actor.pos.x + actor.size.x > other.pos.x &&
                        actor.pos.x < other.size.x + other.pos.x &&
                        actor.pos.y + actor.size.y > other.pos.y &&
                        actor.pos.y < other.size.y + other.pos.y) {
                        return other;
                    }
                    break;
                case 'circle':
                    // square to circle
                    const centerX = (other.pos.x + 0.5) * cellSize;
                    const centerY = (other.pos.y + 0.5) * cellSize;

                    const clampedX = clamp(centerX, actor.pos.x * cellSize, actor.pos.x * cellSize + actor.size.x * cellSize);
                    const clampedY = clamp(centerY, actor.pos.y * cellSize, actor.pos.y * cellSize + actor.size.y * cellSize);

                    if ((clampedX - centerX)**2 + (clampedY - centerY)**2 <= (other.size.x * 0.5 * cellSize)**2 ) {
                        return other;
                    }

                    break;
            }
        }
    }

    updateCamera(x) {
        const xx = x * this.cellSize;
        const center = this.canvasWidth / 2;
        const endX = this.cellsX * this.cellSize - center;

        if (xx > center && xx < endX) {
            this.cameraX = Math.floor((center - xx));
        } else if (xx < endX) {
            this.cameraX = 0;
        }
    }

    getViewParams() {
        if (this.cameraX < this.cellSize) {
            const cellsLeft = -Math.floor(this.cameraX / this.cellSize) - 1;
            return {
                x: [cellsLeft, this.canvasWidth / this.cellSize + cellsLeft + 1]
            }
        } else {
            return {
                x: [0, Math.floor(this.canvasWidth / this.cellSize)]
            }
        }
    }
}

export default Level;
