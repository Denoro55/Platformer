import Player from '../actors/Player';
import Coin from "../actors/Coin";
import Lava from "../actors/Lava";
import Sphere from "../actors/Sphere";
import Saw from "../actors/Saw";
import Vector from "../helpers/Vector";

const objectsFromMap = {
    0:  null,
    1: 'wall',
    2: 'lava'
};

const actors = {
    3: Player,
    4: Sphere,
    5: Coin,
    6: Saw,
    2: Lava, 'V': Lava
};

class Level {
    constructor(game, currentMap) {
        const map = currentMap.tiles;

        this.ctx = game.ctx;
        this.width = map[0].length;
        this.height = map.length;
        this.grid = [];
        this.actors = [];
        this.fail = false;

        // params
        this.checkSize = 15;
        this.size = 32;
        this.step = 0.016;

        for (let i = 0; i < this.height; i++) {
            let gridLine = [];
            for (let n = 0; n < this.width; n++) {
                const currentCell = map[i][n];
                // const Actor = actors[currentCell];
                // if (Actor) {
                //     this.actors.push(new Actor(new Vector(n, i), currentCell));
                // }
                let objectType = objectsFromMap[currentCell] || null;
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

        console.log(this.grid, this.actors);
    }

    animate(arrows) {
        this.actors.forEach(actor => {
            actor.act(this, arrows);
        });
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
        for (let i = 0; i < this.actors.length; i++) {
            const other = this.actors[i];
            if (other !== actor &&
                actor.pos.x + actor.size.x > other.pos.x &&
                actor.pos.x < other.size.x + other.pos.x &&
                actor.pos.y + actor.size.y > other.pos.y &&
                actor.pos.y < other.size.y + other.pos.y) {
                return other;
            }
        }
    }

    playerTouched(other, player) {
        switch (other.type) {
            case 'coin':
                this.actors = this.actors.filter(actor => actor !== other);
                if (!this.actors.some(actor => {
                    return actor.type === 'coin';
                })) {
                    this.status = 'win';
                }
                break;
            case 'sphere':
                other.activate(player);
                break;
            case 'lava':
                this.status = 'lost';
                break;
            case 'enemy':
                this.status = 'lost';
                break;
        }
    }
}

export default Level;
