import Colors from "../helpers/types/Colors";

export default class  {
    constructor(params) {
        this.pos = params.pos;
        this.endTimer = 80 + Math.random() * 70;
        this.timer = Math.random() * 50;
        this.style = 'fill';
        this.color = Colors.lava;
        this.updateOffset();
        this.alpha = 1;
        this.type = 'bubble';
    }

    act() {

    }

    update() {
        if (this.timer < this.endTimer + 30) {
            this.timer += 4;
            if (this.timer > this.endTimer) {
                this.alpha -= 0.1;
            }
        } else {
            this.timer = 0;
            this.endTimer = 100 + Math.random() * 100;
            this.alpha = 1;
            this.updateOffset();
        }
    }

    updateOffset() {
        this.offsetX = - .3 + Math.random() * .6;
    }
}
