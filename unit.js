function unit(id){
    this.id = id;
    
    this.hp = 10;
    this.attack = 1;
    this.defense = 1;
    
    this.tile;
    
    this.move = function(tile){
        this.tile = tile;
    };
}

function _placeUnit(unit, x, y, map){
    map[getLoc(x,y)].onTile = unit;
    map.units[unit.id] = unit;
    unit.tile = map[getLoc(x,y)];
}