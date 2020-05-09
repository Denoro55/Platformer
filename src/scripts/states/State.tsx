import Engine from "../Engine";

export default abstract class {
    stateName: string;

    abstract update(engine: Engine): void;
    abstract render(engine: Engine): void;
}
