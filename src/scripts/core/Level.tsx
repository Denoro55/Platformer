import Player from '../actors/Player';
import Vector from "../helpers/Vector";
import Star from "../effects/Star";
import {getRandomPoint, clamp} from "../helpers/functions";
import {Colors} from "../helpers/types/index";
import Bubble from "../effects/Bubble";
import Engine from "../Engine";
import {Codes} from "../helpers/interfaces/index";
import {Statuses} from "../helpers/enums/index";

import tilesFromMap from "../map/tilesFromMap";
import actorsFromMap from "../map/actorsFromMap";

class Level {
    debug: object;

    ctx: any;

    status: Statuses;

    cellSize: number;
    canvasWidth: number;
    canvasHeight: number;
    cellsX: number;
    cellsY: number;
    step: number;
    playerHp: number;
    cameraX: number;
    timeNextLevel: number;
    checkSize: number;
    currentCamera: number[];

    firstLayer: any[];
    grid: any[];
    actors: any[];
    effects: any[];

    win: boolean;

    player: any;

    constructor(engine: Engine, currentMap: any) {
        const mapTiles = currentMap.tiles;
        this.debug = engine.config.debug;

        this.ctx = engine.ctx;

        this.canvasWidth = engine.gameWidth;
        this.canvasHeight = engine.gameHeight;

        this.cellsX = mapTiles[0].length;
        this.cellsY = mapTiles.length;

        this.firstLayer = [];
        this.grid = [];
        this.actors = [];
        this.effects = [];
        this.player = null;

        this.win = false;
        this.timeNextLevel = -1;

        this.playerHp = 0;
        this.cameraX = 0;
        this.currentCamera = [];

        // params
        this.cellSize = 32;
        this.step = 0.016;

        // size of check (game status)
        this.checkSize = 15;

        for (let i = 0; i < this.cellsY; i++) {
            let gridLine: any[] = [];
            for (let n = 0; n < this.cellsX; n++) {
                const currentCell = mapTiles[i][n];
                let objectType = tilesFromMap[currentCell].name;

                // create bubbles and add lava to first layer
                if (objectType === 'lava') {
                    this.firstLayer.push({
                        name: 'lava',
                        x: n,
                        y: i
                    });
                    const upperCell: string = mapTiles[i - 1][n];
                    const isLava: boolean = tilesFromMap[upperCell].name === 'lava';
                    if (!isLava) {
                        this.effects.push(new Bubble({
                            pos: new Vector(n, i)
                        }));
                    }
                }
                gridLine.push(objectType);
            }
            this.grid.push(gridLine);
        }

        currentMap.actors.forEach((actor: any) => {
            const Actor = actorsFromMap[actor.gid];

            const x = (actor.x / this.cellSize);
            const y = (actor.y / this.cellSize) - 1;

            this.actors.push(new Actor(new Vector(x, y), actor.properties));
        });

        this.player = this.actors.find(actor => actor instanceof Player);

        const viewParams = this.currentCamera;

        // stars
        for (let i = 0; i < 20; i++) {
            this.effects.push(new Star({
                pos: getRandomPoint(viewParams[0] + this.canvasWidth / this.cellSize, this.canvasHeight / this.cellSize - 4),
                size: new Vector(0, 0),
                color: Colors.white,
                rotation: 0,
                delay: Math.random() * 60
            }))
        }
    }

    animate(keys: Codes) {
        this.actors.forEach(actor => {
            actor.act(this, keys);
        });
        this.effects.forEach(effect => {
            effect.update(this);
        });

        // win animation
        if (this.timeNextLevel > 0) {
            this.timeNextLevel -= 1;
        } else if (this.timeNextLevel === 0) {
            this.status = Statuses.win;
        }
    }

    obstacleAt(pos: Vector, actorSize: Vector) {
        const startX = Math.floor(pos.x);
        const endX = Math.ceil(pos.x + actorSize.x);
        const startY = Math.floor(pos.y);
        const endY = Math.ceil(pos.y + actorSize.y);

        let result: any = {
            actors: [],
            pos: {}
        };

        const collider: any = {
            type: 'wall',
            actors: ['wall'],
            pos: null
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

    actorAt(pos: Vector, size: Vector) {
        const cellSize = this.cellSize;

        for (let i = 0; i < this.actors.length; i++) {
            const other = this.actors[i];

            if (!other.collides) continue;

            switch (other.shape) {
                case 'square':
                    // square to square
                    if (other !== this.player &&
                        pos.x + size.x > other.pos.x &&
                        pos.x < other.size.x + other.pos.x &&
                        pos.y + size.y > other.pos.y &&
                        pos.y < other.size.y + other.pos.y) {
                        return other;
                    }
                    break;
                case 'circle':
                    // square to circle
                    const centerX = (other.pos.x + 0.5) * cellSize;
                    const centerY = (other.pos.y + 0.5) * cellSize;

                    const clampedX = clamp(centerX, pos.x * cellSize, pos.x * cellSize + size.x * cellSize);
                    const clampedY = clamp(centerY, pos.y * cellSize, pos.y * cellSize + size.y * cellSize);

                    if ((clampedX - centerX)**2 + (clampedY - centerY)**2 <= (other.size.x * 0.5 * cellSize)**2 ) {
                        return other;
                    }

                    break;
            }
        }
    }

    // actorAt(actor: Player) {
    //     const cellSize = this.cellSize;
    //
    //     for (let i = 0; i < this.actors.length; i++) {
    //         const other = this.actors[i];
    //
    //         switch (other.shape) {
    //             case 'square':
    //                 // square to square
    //                 if (other !== actor &&
    //                     actor.pos.x + actor.size.x > other.pos.x &&
    //                     actor.pos.x < other.size.x + other.pos.x &&
    //                     actor.pos.y + actor.size.y > other.pos.y &&
    //                     actor.pos.y < other.size.y + other.pos.y) {
    //                     return other;
    //                 }
    //                 break;
    //             case 'circle':
    //                 // square to circle
    //                 const centerX = (other.pos.x + 0.5) * cellSize;
    //                 const centerY = (other.pos.y + 0.5) * cellSize;
    //
    //                 const clampedX = clamp(centerX, actor.pos.x * cellSize, actor.pos.x * cellSize + actor.size.x * cellSize);
    //                 const clampedY = clamp(centerY, actor.pos.y * cellSize, actor.pos.y * cellSize + actor.size.y * cellSize);
    //
    //                 if ((clampedX - centerX)**2 + (clampedY - centerY)**2 <= (other.size.x * 0.5 * cellSize)**2 ) {
    //                     return other;
    //                 }
    //
    //                 break;
    //         }
    //     }
    // }

    updateCamera(x: number) {
        const xx = x * this.cellSize;
        const center = this.canvasWidth / 2;
        const endX = this.cellsX * this.cellSize - center;

        if (xx > center && xx < endX) {
            this.cameraX = Math.floor((center - xx));
        } else if (xx < endX) {
            this.cameraX = 0;
        }

        if (this.cameraX < this.cellSize) {
            const cellsLeft = -Math.floor(this.cameraX / this.cellSize) - 1;
            this.currentCamera = [Math.max(0, cellsLeft), this.canvasWidth / this.cellSize + cellsLeft + 1]
        } else {
            this.currentCamera = [0, Math.floor(this.canvasWidth / this.cellSize)]
        }
    }

    inCamera(x: number) {
        return x >= this.currentCamera[0] && x < this.currentCamera[1]
    }
}

export default Level;
