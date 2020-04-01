import Engine from "./Engine"

// states
import Menu from "./states/Menu"
import Game from "./states/Game"

// maps
import level1 from './maps/level1';
console.log(level1);

const maps = [level1];

const canvas = document.querySelector('canvas');

const config = {
    development: false,
    debug: true,
    scriptTime: true
};

const engine = new Engine(canvas, maps, config);
engine.addState('menu', Menu);
engine.addState('game', Game);
engine.runState('menu');

