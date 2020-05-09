import "@babel/polyfill";

import Engine from "./Engine"
import Debugger from "./Debugger";
import config from './config/index'

// states
import Menu from "./states/Menu"
import Game from "./states/Game"

// preload
const fakeImage: any = new Image();
fakeImage.src = './img/bg/4.jpg';

const canvas = document.querySelector('canvas');

const engine = new Engine(canvas, config, Debugger);
engine.addState('menu', Menu);
engine.addState('game', Game);
engine.runState('menu');
