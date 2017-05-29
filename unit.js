function unit(id, stats, team){
    this.id = id;
    
    this.hp = 10;
    this.attack = 3;
    this.defense = 0;
    this.movement = 2;
    this.attackRange = 1;
    this.effectRange = 0;
    this.moveableTerrain = "grass";
    
    //0-neutral 1-ally 2-enemy
    this.team = 0;
    if(team)
        this.team = team;
    
    for(var i in stats)
        this[i] = stats[i];
    
    this.tile;
    this.div;
    
    //Used for UI
    this.selected = false;
    
    //States as attributes on div
    this.hasWalked = false;
    this.hasAttacked = false;
}

    unit.prototype.walkTo = function(tile){
        //Removes unit from old tile
        this.tile.onTile = null;
        
        //Places unit on new tile
        this.tile = tile;
        this.hasWalked = true;
        tile.onTile = this;
    };
    
    unit.prototype.attackUnit = function(unit){
        console.log(this.id+" attacks "+unit.id+" with "+this.attack+" attack.");
        var damage = this.attack;
        unit.takeDamage(damage);
        this.hasAttacked = true;
    }
    
    unit.prototype.takeDamage = function(damage){
        this.hp -= damage-this.defense;
        if(this.hp < 0)
            this.hp = 0;
        console.log(this.id+":"+this.hp+" hp left.");
        this.checkDeath();
    }
    
    unit.prototype.checkDeath = function(){
        if(this.hp == 0){
            this.dead = true;
            console.log(this.id+" is dead.");
        }
    }
    
    unit.prototype.moveableTiles = function(){
        return trueTraverse(this.movement, this.tile, this.moveableTerrain, this.team).tiles;
        //Use bottom function for flyers or units that can't be blocked
        //return traverseRadial(this.movement, this.tile, 0);
    }
    
    unit.prototype.attackableTiles = function(){
        return traverseRadial(this.attackRange, this.tile, 0).tiles;
    }
    
    unit.prototype.endTurn = function(){
        this.hasWalked = true;
        this.hasAttacked = true;
    }
    
    unit.prototype.startTurn = function(){
        this.hasWalked = false;
        this.hasAttacked = false;
    }

function _placeUnit(unit, x, y, map){
    map[getLoc(x,y)].onTile = unit;
    map.units[unit.id] = unit;
    unit.tile = map[getLoc(x,y)];
}