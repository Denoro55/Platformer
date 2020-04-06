import Vector from "./Vector"

function getRandomPoint (width: number, height: number) {
    return new Vector(Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (height + 1)))
}

function clamp (x: number, min: number, max: number) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
}

function getActorProperty(props: any, propName: string, defaultValue: any) {
    if (!props) return defaultValue;
    const prop = props.find((prop: any) => prop.name === propName);
    if (!prop) return defaultValue;
    return prop.value;
}

export { getRandomPoint, clamp, getActorProperty };
