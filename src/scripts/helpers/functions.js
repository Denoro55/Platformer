import Vector from "./Vector"

function getRandomPoint (width, height) {
    return new Vector(Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (height + 1)))
}

function clamp (x, min, max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
}

export { getRandomPoint, clamp };
