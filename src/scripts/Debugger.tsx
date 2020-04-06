import {GameStates} from "./helpers/enums/index";
import Engine from "./Engine";

let times = 0;
let timeSum = 0;

export default class {
    private time: number;
    engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
        this.time = 0;
    }

    start() {
        this.time = performance.now();
    }

    end() {
        const engine = this.engine;
        const endTime = performance.now() - this.time;

        if (engine.config.scriptTime) {
            console.log('Время выполнения = ', endTime);
        }

        if (engine.config.gameTime) {
            const activeState = engine.getCurrentState();
            if (activeState.stateName === 'game' && activeState.state === GameStates.game && activeState.gameTime) {
                times++;
                timeSum += endTime;
                console.log('Время выполнения = ', timeSum / times);
            }
        }
    }
}
