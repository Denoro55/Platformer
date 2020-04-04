import Level from "../core/Level";
import Display from "../core/Display"
import Engine from "../Engine";
import {Codes} from "../interfaces/index";

enum States {
    preload = 'preload',
    game = 'game'
}

interface ParsedMap {
    tiles: any[],
    actors: any[],
}

export default class Game {
    state: string;
    currentLevel: number;
    currentMap: any;
    loadedMapIndex: number;
    keys: Codes;
    level: Level;
    display: Display;

    constructor(engine: Engine) {
        this.state = States.preload;
        this.currentLevel = 1;
        this.currentMap = null;
        this.loadedMapIndex = null;
        const arrowCodes: Codes = {37: "left", 38: "up", 39: "right", 90: 'z'};
        this.keys = this.trackKeys(arrowCodes);
    }

    async create(engine: Engine) {
        this.state = States.preload;
        let map: any;
        if (this.loadedMapIndex !== this.currentLevel) {
            try {
                map = await this.loadMap(this.currentLevel);
                this.currentMap = map;
                this.loadedMapIndex = this.currentLevel;
            } catch (e) {
                map = this.currentMap;
            }
        } else {
            map = this.currentMap;
        }
        this.level = new Level(engine, map);
        this.display = new Display(this.level);
        this.state = States.game;
    }

    trackKeys(codes: Codes) {
        const pressed: {
            [key: string]: any
        } = {};
        const handler = (e: any) => {
            if (codes.hasOwnProperty(e.keyCode)) {
                const code = codes[e.keyCode];
                pressed[codes[e.keyCode]] = e.type === 'keydown';
                e.preventDefault();
            }
        };
        addEventListener('keydown', handler);
        addEventListener('keyup', handler);
        return pressed;
    }

    update(engine: Engine) {
        if (this.state === 'game') {
            this.level.animate(this.keys);
            if (this.level.status === 'lost') {
                this.create(engine);
            } else if (this.level.status === 'win') {
                this.currentLevel += 1;
                this.create(engine);
            }
        }
    }

    render(engine: Engine) {
        if (this.state === States.game) {
            this.display.drawFrame(this);
        } else if (this.state === States.preload) {
            const ctx = engine.ctx;
            ctx.globalAlpha = 1;
            ctx.font = "18px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Загрузка уровня...", engine.gameWidth / 2, engine.gameHeight / 2);
        }
    }

    loadMap(level: number) {
        const parsedMap: ParsedMap = {
            tiles: [],
            actors: []
        };

        return new Promise((resolve, reject) => {
            fetch(`/maps/level${level}.json`)
                .then(response => response.json())
                .then(map => {
                    // tiles
                    const tilesLayer = map.layers.find((layer: any) => layer.name === 'tiles');

                    const data = tilesLayer.data;
                    const width = tilesLayer.width;
                    const height = tilesLayer.height;

                    for (let h = 0; h < height; h++) {
                        let gridLine = [];
                        for (let w = 0; w < width; w++) {
                            gridLine.push(data[(h * width) + w]);
                        }
                        parsedMap.tiles.push(gridLine);
                    }

                    //actors
                    const actorsLayer = map.layers.find((layer: any) => layer.name === 'actors');

                    actorsLayer.objects.forEach((actor: any) => {
                        parsedMap.actors.push(actor)
                    });

                    setTimeout(() => {
                        resolve(parsedMap);
                    }, 500);
                }).catch(e => {
                    reject(e);
                })
        })
    }
}
