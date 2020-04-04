import Engine from "../Engine";

export default class Menu {
    constructor(engine: Engine, params: object) {
        addEventListener('keyup', (e) => {
            if (e.keyCode === 83 && engine.getCurrentState() === this) {
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
