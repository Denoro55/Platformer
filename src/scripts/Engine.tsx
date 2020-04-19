import Debugger from "./Debugger";

class FakeDebugger {
    start() {}
    end() {}
}

export default class Engine {
    private debug: Debugger;
    private states: {
        [key: string]: any,
    };
    private activeState: string;
    readonly canvas: any;
    readonly ctx: any;
    readonly gameWidth: number;
    readonly gameHeight: number;
    private _config: {
        [key: string]: any,
    };

    constructor(canvas: any, config: object, debug?: any) {
        this.debug = debug !== undefined ? new debug(this) : new FakeDebugger;
        this.states = {};
        this.activeState = null;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.gameWidth = this.canvas.width;
        this.gameHeight = this.canvas.height;
        this._config = config;
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

    runFrame() {
        this.states[this.activeState].update(this);
        this.states[this.activeState].render(this);
    }

    run() {
        const frame = () => {
            this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);

            this.debug.start();
            this.runFrame();
            this.debug.end();

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
}
