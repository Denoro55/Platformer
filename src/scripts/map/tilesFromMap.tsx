import DOMDisplay from "../core/Display";

const tilesFromMap: any = {
    0: {
        name: '',
        color: 'transparent',
        draw: (ctx: any, display: DOMDisplay, options: any) => {
            // empty
        }
    },
    1: {
        name: 'wall',
        color: 'black',
        draw: (ctx: any, display: DOMDisplay, options: any) => {
            ctx.drawImage(display.tile, 0, 0, 36, 36, options.x * options.size - 2, options.y * options.size  - 2, 36, 36);
        }
    },
    2: {
        name: 'lava',
        color: '#1cec82',
        draw: (ctx: any, display: DOMDisplay, options: any) => {
            if (options.layer !== -1) return;
            ctx.rect(options.x * options.size, options.y * options.size, options.size, options.size);
            ctx.fill();
        }
    },
    // 7: {
    //     name: 'wall_ghost',
    //     color: 'white',
    //     draw: (ctx: any, display: DOMDisplay, options: any) => {
    //         ctx.drawImage(display.tile, 36, 0, 36, 36, options.x * options.size - 2, options.y * options.size  - 2, 36, 36);
    //     }
    // },
};

export default tilesFromMap;
