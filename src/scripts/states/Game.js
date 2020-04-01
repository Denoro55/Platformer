import Level from "../core/Level"
import Display from "../core/Display"

export default class Game {
    constructor() {
        const arrowCodes = {37: "left", 38: "up", 39: "right", 90: 'z'};
        this.keys = this.trackKeys(arrowCodes);
    }

    create(game) {
        this.level = new Level(game, game.maps[game.currentLevel]);
        this.display = new Display(this.level);
    }

    trackKeys(codes) {
        const pressed = {};
        const handler = (e) => {
            if (codes.hasOwnProperty(e.keyCode)) {
                pressed[codes[e.keyCode]] = e.type === 'keydown';
                e.preventDefault();
            }
        };
        addEventListener('keydown', handler);
        addEventListener('keyup', handler);
        return pressed;
    }

    update(game) {
        this.level.animate(this.keys);
        if (this.level.status === 'lost') {
            this.create(game);
            return false;
        }
    }

    render(game) {
        this.display.drawFrame(game);
    }
}
