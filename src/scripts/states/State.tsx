import Engine from "../Engine";

export default abstract class {
    stateName: string;

    constructor() {
        this.stateName = this.constructor.name.toLowerCase();
    }

    abstract update(engine: Engine): void;
    abstract render(engine: Engine): void;
}
