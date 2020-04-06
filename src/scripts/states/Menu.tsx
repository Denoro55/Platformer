import Engine from "../Engine";
import State from "./State";

export default class Menu extends State {
    constructor(engine: Engine, params: object) {
        super();
        addEventListener('keyup', (e) => {
            if (e.keyCode === 83 && engine.getCurrentState().stateName === 'menu') {
                engine.changeState('game');
            }
        });
    }

    update() {

    }

    render(engine: Engine) {
        const ctx = engine.ctx;
        ctx.font = "18px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Нажмите \"S\", чтобы начать игру.", engine.gameWidth / 2, engine.gameHeight / 2);
    }
}
