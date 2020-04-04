import Lava from "../actors/Lava";
import Player from "../actors/Player";
import Sphere from "../actors/Sphere";
import Coin from "../actors/Coin";
import Saw from "../actors/Saw";
import SpiritWall from "../actors/SpiritWall";

const actorsFromMap: any = {
    2: Lava,
    3: Player,
    4: Sphere,
    5: Coin,
    6: Saw,
    7: SpiritWall
};

export default actorsFromMap;
