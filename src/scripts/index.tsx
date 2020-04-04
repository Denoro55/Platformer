import "@babel/polyfill";

import Engine from "./Engine"
import config from './config/index'

// states
import Menu from "./states/Menu"
import Game from "./states/Game"

const canvas = document.querySelector('canvas');

const engine = new Engine(canvas, config);
engine.addState('menu', Menu);
engine.addState('game', Game);
engine.runState('menu');
