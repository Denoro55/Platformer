import Level from "../core/Level";
import Display from "../core/Display"
import Engine from "../Engine";
import {Codes} from "../helpers/interfaces/index";
import {GameStates} from "../helpers/enums/index";
import State from "./State";

interface ParsedMap {
    tiles: any[],
    actors: any[],
}

const arrowCodes: Codes = {37: "left", 38: "up", 39: "right", 90: 'z'};

const trackKeys = (codes: Codes) => {
    const pressed: {
        [key: string]: any
    } = {};
    const handler = (e: any) => {
        if (codes.hasOwnProperty(e.keyCode)) {
            const code = codes[e.keyCode];
            pressed[code] = e.type === 'keydown';
            e.preventDefault();
        }
    };
    addEventListener('keydown', handler);
    addEventListener('keyup', handler);
    return pressed;
};

export default class Game extends State {
    stateName = 'game';

    state: string;
    currentLevel: number;
    currentMap: any;
    loadedMapIndex: number;
    keys: Codes;
    level: Level;
    display: Display;
    gameTime: boolean;

    constructor(engine: Engine) {
        super();
        this.state = GameStates.preload;
        this.currentLevel = engine.config.level;
        this.currentMap = null;
        this.loadedMapIndex = null;
        this.keys = trackKeys(arrowCodes);
    }

    async create(engine: Engine) {
        this.gameTime = false;
        this.state = GameStates.preload;
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
        this.state = GameStates.game;

        setTimeout(() => {
            this.gameTime = true;
        }, 2000);
    }

    update(engine: Engine) {
        if (this.state === 'game') {
            this.level.animate(this.keys);
            switch (this.level.status) {
                case 'lost':
                    this.create(engine);
                    break;
                case 'win':
                    this.currentLevel += 1;
                    this.create(engine);
                    break;
            }
        }
    }

    render(engine: Engine) {
        switch (this.state) {
            case GameStates.game:
                this.display.drawFrame(this);
                break;
            case GameStates.preload:
                const ctx = engine.ctx;
                ctx.globalAlpha = 1;
                ctx.font = "18px Arial";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText("Загрузка уровня...", engine.gameWidth / 2, engine.gameHeight / 2);
                break;
        }
    }

    loadMap(level: number) {
        const parsedMap: ParsedMap = {
            tiles: [],
            actors: []
        };

        return new Promise((resolve, reject) => {
            fetch(`./maps/level${level}.json`)
                .then(response => response.json())
                .then(map => {
                    // tiles
                    const tilesLayer = map.layers.find((layer: any) => layer.name === 'tiles');

                    const data = tilesLayer.data;
                    const width = tilesLayer.width;
                    const height = tilesLayer.height;

                    for (let h = 0; h < height; h++) {
                        let gridLine: any = [];
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
