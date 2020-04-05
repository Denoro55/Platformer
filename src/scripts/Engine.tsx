import {GameStates} from "./helpers/enums/index";
import Game from "./states/Game";

let times = 0;
let timeSum = 0;

export default class Engine {
    private states: {
        [key: string]: any,
    };
    private activeState: string;
    private canvas: any;
    readonly ctx: any;
    readonly gameWidth: number;
    readonly gameHeight: number;
    private _config: {
        [key: string]: any,
    };

    constructor(canvas: any, config: object) {
        this.states = {};
        this.activeState = null;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.gameWidth = this.canvas.width;
        this.gameHeight = this.canvas.height;
        this._config = config;

        const fakeImage: any = new Image();
        fakeImage.src = '/img/bg/4.jpg';
    }

    addState(name: string, handler: any, params: object = {}) {
        this.states[name] = new handler(this, params);
    }

    runState(name: string) {
        this.activeState = name;
        this.run();
    }

    changeState(name: string, params: object = {}) {
        this.activeState = name;
        this.states[this.activeState].create(this, params);
    }

    run() {
        const frame = () => {
            this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
            var time = performance.now();
            this.states[this.activeState].update(this);
            this.states[this.activeState].render(this);

            time = performance.now() - time;
            if (this._config.gameTime) {
                const game = this.getCurrentState();
                if (game instanceof Game && game.state === GameStates.game && game.gameTime) {
                    times++;
                    timeSum += time;
                    console.log('Время выполнения = ', timeSum / times);
                }
            }

            if (this._config.scriptTime) {
                console.log('Время выполнения = ', time);
            }

            window.requestAnimationFrame(frame);
        };
        frame();
    }

    get config() {
        return this._config;
    }

    getCurrentState() {
        return this.states[this.activeState];
    }

    // parseMaps(maps) {
    //     let parsedMaps = [];
    //
    //     maps.forEach(map => {
    //         const parsedMap = {
    //             tiles: [],
    //             actors: []
    //         };
    //
    //         // tiles
    //         const tilesLayer = map.layers.find(layer => layer.name === 'tiles');
    //
    //         const data = tilesLayer.data;
    //         const width = tilesLayer.width;
    //         const height = tilesLayer.height;
    //
    //         for (let h = 0; h < height; h++) {
    //             let gridLine = [];
    //             for (let w = 0; w < width; w++) {
    //                 gridLine.push(data[(h * width) + w]);
    //             }
    //             parsedMap.tiles.push(gridLine);
    //         }
    //
    //         //actors
    //         const actorsLayer = map.layers.find(layer => layer.name === 'actors');
    //
    //         actorsLayer.objects.forEach(actor => {
    //             parsedMap.actors.push(actor)
    //         });
    //
    //         // console.log(parsedMap);
    //         parsedMaps.push(parsedMap);
    //     });
    //
    //     return parsedMaps;
    // }
}
