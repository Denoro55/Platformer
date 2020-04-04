class Vector {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    plus(other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    times(factor: number) {
        return new Vector(this.x * factor, this.y * factor);
    }
}

export default Vector;
