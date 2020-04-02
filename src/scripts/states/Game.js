import Level from "../core/Level"
import Display from "../core/Display"

export default class Game {
    constructor(engine) {
        const arrowCodes = {37: "left", 38: "up", 39: "right", 90: 'z'};
        this.keys = this.trackKeys(arrowCodes);
    }

    create(engine) {
        this.level = new Level(engine, engine.maps[engine.currentLevel]);
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

    update(engine) {
        this.level.animate(this.keys);
        if (this.level.status === 'lost') {
            this.create(engine);
            return false;
        }
    }

    render(game) {
        this.display.drawFrame(game);
    }
}
