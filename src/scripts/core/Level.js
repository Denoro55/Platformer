import Player from '../actors/Player';
import Coin from "../actors/Coin";
import Lava from "../actors/Lava";
import Sphere from "../actors/Sphere";
import Saw from "../actors/Saw";
import Vector from "../helpers/Vector";
import Star from "../effects/Star";
import {getRandomPoint} from "../helpers/functions";
import Colors from "../helpers/Colors";
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

// circle
function clamp (x, min, max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
}

class Level {
    constructor(game, currentMap) {
        const map = currentMap.tiles;

        this.debug = false;
        this.ctx = game.ctx;
        this.width = map[0].length;
        this.height = map.length;
        this.grid = [];
        this.actors = [];
        this.effects = [];
        this.fail = false;

        this.playerHp = 0;
        this.cameraX = 0;

        // params
        this.checkSize = 15;
        this.size = 32;
        this.step = 0.016;

        for (let i = 0; i < this.height; i++) {
            let gridLine = [];
            for (let n = 0; n < this.width; n++) {
                const currentCell = map[i][n];
                let objectType = objectsFromMap[currentCell] || null;

                // create bubbles
                if (objectType === 'lava') {
                    this.effects.push(new Bubble({
                        pos: new Vector(n, i),
                        size: new Vector(1, 1),
                        color: Colors.white,
                        strokeWidth: 1,
                        rotation: 0,
                        delay: Math.random() * 60,
                        style: 'fill'
                    }))
                }
                gridLine.push(objectType)
            }
            this.grid.push(gridLine);
        }

        currentMap.actors.forEach(actor => {
            const Actor = actors[actor.gid];

            const x = (actor.x / this.size);
            const y = (actor.y / this.size) - 1;

            this.actors.push(new Actor(new Vector(x, y), 0));
        });

        // stars
        for (let i = 0; i < 20; i++) {
            this.effects.push(new Star({
                pos: getRandomPoint(this.width, this.height),
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
                y: this.height
            };
            return collider;
        } else if (endX > this.width) {
            collider.pos = {
                x: this.width,
                y: this.height
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
        const cellSize = this.size;

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
        if (x > this.width / 2) {
            this.cameraX = Math.floor((this.width / 2 - x) * this.size);
        } else {
            this.cameraX = 0;
        }
    }

    // playerTouched(other, player) {
    //     console.log('touched ', other);
    //     switch (other.type) {
    //         case 'coin':
    //             this.actors = this.actors.filter(actor => actor !== other);
    //             if (!this.actors.some(actor => {
    //                 return actor.type === 'coin';
    //             })) {
    //                 this.status = 'win';
    //             }
    //             break;
    //         case 'sphere':
    //             other.activate(player);
    //             break;
    //         case 'lava':
    //             this.status = 'lost';
    //             break;
    //         case 'enemy':
    //             this.status = 'lost';
    //             break;
    //     }
    // }
}

export default Level;
