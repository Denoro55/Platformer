export default class Engine {
    constructor(canvas, maps, config) {
        this.states = {};
        this.activeState = null;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.gameWidth = this.canvas.width;
        this.gameHeight = this.canvas.height;
        this.maps = this.parseMaps(maps);
        this.currentLevel = 0;
        this.config = config;
    }

    addState(name, handler, params = {}) {
        this.states[name] = new handler(this, params);
    }

    runState(name) {
        this.activeState = name;
        this.run();
    }

    changeState(name, params = {}) {
        this.activeState = name;
        this.states[this.activeState].create(this, params);
    }

    run() {
        const frame = () => {
            this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
            var time = performance.now();
            this.states[this.activeState].update(this);
            this.states[this.activeState].render(this);
            time = performance.now() - time;
            if (this.config.scriptTime) {
                console.log('Время выполнения = ', time);
            }
            window.requestAnimationFrame(frame);
        };
        frame();
    }

    parseMaps(maps) {
        let parsedMaps = [];

        maps.forEach(map => {
            const parsedMap = {
                tiles: [],
                actors: []
            };

            // tiles
            const tilesLayer = map.layers.find(layer => layer.name === 'tiles');

            const data = tilesLayer.data;
            const width = tilesLayer.width;
            const height = tilesLayer.height;

            for (let h = 0; h < height; h++) {
                let gridLine = [];
                for (let w = 0; w < width; w++) {
                    gridLine.push(data[(h * width) + w]);
                }
                parsedMap.tiles.push(gridLine);
            }

            //actors
            const actorsLayer = map.layers.find(layer => layer.name === 'actors');

            actorsLayer.objects.forEach(actor => {
                parsedMap.actors.push(actor)
            });

            console.log(parsedMap);
            parsedMaps.push(parsedMap);
        });

        return parsedMaps;
    }
}
