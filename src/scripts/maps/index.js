(function(name,data){
    if(typeof onTileMapLoaded === 'undefined') {
        if(typeof TileMaps === 'undefined') TileMaps = {};
        TileMaps[name] = data;
    } else {
        onTileMapLoaded(name,data);
    }
    if(typeof module === 'object' && module && module.exports) {
        module.exports = data;
    }})("5",
    { "compressionlevel":-1,
        "height":4,
        "infinite":false,
        "layers":[
            {
                "data":[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "height":4,
                "id":1,
                "name":"\u0421\u043b\u043e\u0439 \u0442\u0430\u0439\u043b\u043e\u0432 1",
                "opacity":1,
                "type":"tilelayer",
                "visible":true,
                "width":4,
                "x":0,
                "y":0
            }],
        "nextlayerid":2,
        "nextobjectid":1,
        "orientation":"orthogonal",
        "renderorder":"right-down",
        "tiledversion":"1.3.3",
        "tileheight":32,
        "tilesets":[
            {
                "firstgid":1,
                "source":"tiles.tsx"
            }],
        "tilewidth":32,
        "type":"map",
        "version":1.2,
        "width":4
    });
