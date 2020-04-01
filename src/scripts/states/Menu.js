export default class Menu {
    constructor(game, params) {
        addEventListener('keyup', (e) => {
            if (e.keyCode === 83 && game.states[game.activeState] === this) {
                game.changeState('game');
            }
        });
    }

    update() {

    }

    render(game) {
        const ctx = game.ctx;
        ctx.font = "18px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Нажмите \"S\", чтобы начать игру.", game.canvas.width / 2, game.canvas.height / 2);
    }
}