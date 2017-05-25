function unit(id, stats){
    this.id = id;
    
    this.hp = 10;
    this.attack = 2;
    this.defense = 1;
    this.movement = 3;
    this.attackRange = 1;
    this.effectRange = 1;
    this.moveableTerrain = "grass";
    
    for(var i in stats)
        this[i] = stats[i];
    
    this.tile;
    
    this.selected = false;
    this.hasWalked = false;
    this.hasAttacked = false;
    
    this.move = function(tile){
        this.tile = tile;
    };
    
    this.attackUnit = function(unit){
        console.log(this.id+" attacks "+unit.id+" with "+this.attack+" attack.");
        var damage = this.attack;
        unit.takeDamage(damage);
        this.hasAttacked = true;
    }
    
    this.takeDamage = function(damage){
        this.hp -= damage-this.defense;
        if(this.hp < 0)
            this.hp = 0;
        console.log(this.id+":"+this.hp+" hp left.");
        this.checkDeath();
    }
    
    this.checkDeath = function(){
        if(this.hp == 0){
            this.dead = true;
            console.log(this.id+" is dead.");
        }
    }
    
    this.moveableTiles = function(){
        return trueTraverse(this.movement, this.tile, this.moveableTerrain).tiles;
        //Use bottom function for flyers or units that can't be blocked
        //return traverseRadial(this.movement, this.tile, 0);
    }
    
    this.attackableTiles = function(){
        return traverseRadial(this.attackRange, this.tile, 0).tiles;
    }
}

function _placeUnit(unit, x, y, map){
    map[getLoc(x,y)].onTile = unit;
    map.units[unit.id] = unit;
    unit.tile = map[getLoc(x,y)];
}