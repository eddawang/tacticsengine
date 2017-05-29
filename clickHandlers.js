
var _selected;
var _selectedRange;
var _selectedAttr;
var _confirm;
var _confirmRange;

//Toggles an attribute for a range of tiles that correspond to a selected unit
//Only one unit can be selected at a time
function toggleSelectUnit(attrName, unit, tileRange){
    var s = unit.selected;
    //Deselect current selection
    if(_selected){
        unsetRange(_selectedRange, _selectedAttr);
        _selected.selected = false;
        _selected = null;
        _selectedAttr = null;
        delete _selectedRange;
    }
    //If targeted unit was not selected, select target
    if(!s){
        var attr = {};
        attr[attrName] = true;
        setRange(tileRange, attr);
        unit.selected = true;
        _selected = unit;
        _selectedRange = tileRange;
        _selectedAttr = attrName;
    }
    
    //Cancel any confirmations
    if(_confirm){
        _confirm = null;
        unsetRange(_confirmRange.tiles, 'effect');
        delete _confirmRange;
    }
}

//Moves unit to targeted Tile
function moveUnit(unit, targetTile){
    //Move unit
    unit.walkTo(targetTile);
    //Draw unit in new location
    drawMoveUnit(unit.id, targetTile.loc);
}


//Handler for tiles
function clickTile(e){
    //Make sure target is the tile and not another unit
    if(e.target != this)
        return;
    
    var tile = _map[e.target.id];
    
    //Check if a unit is currently selected
    if(_selected){
        var walk = e.target.attributes.getNamedItem('walk');
        //Check if tile is a walkable tile i.e. highlighted
        if(walk && !tile.onTile){
            var unit = _selected;
            toggleSelectUnit('walk', _selected);
            moveUnit(unit, tile);
        }
    }
}


//Handler for units
function clickUnit(e){
    var unit = _map.units[e.target.id];
    var tile = unit.tile;
    //Check if unit is being selected as the target of an attack
    if(_selectedAttr=='attack' && _selected!=unit){
        //Check if the tile that the unit is on is within range
        var attack = $(idSelect(tile.loc)).attr('attack');
        if(attack){
            //Check if this is a confirmation click
            if(_confirm == unit){
                //Attack
                for(var i in _confirmRange.onTiles){
                    var t = _confirmRange.onTiles[i];
                    if(t!=_selected)
                        _selected.attackUnit(_confirmRange.onTiles[i]);
                }
                //Update Graphics to show unit has finished turn
                setUnitDivAttr(_selected.id, {hasAttacked:_selected.hasAttacked});
                //Deselect unit
                toggleSelectUnit('attack',_selected);
            }else{
                //Show effect range and wait for confirmation click
                _confirm = unit;
                if(_confirmRange){
                    unsetRange(_confirmRange.tiles, 'effect');
                    delete _confirmRange;
                }
                _confirmRange = traverseRadial(_selected.effectRange, tile, 1);
                setRange(_confirmRange.tiles, {effect:true});
                return;
            }
        }else{
            toggleSelectUnit('attack',_selected);            
            //Delete any confirmations 
            if(_confirm){
                _confirm = null;
                unsetRange(_confirmRange.tiles, 'effect');
                delete _confirmRange;
            }
        }
        return;
    }
    
    //Check the units turn (i.e. walk or attack)
    //Highlights corresponding tiles within range for walk/attack
    if(!unit.hasWalked){
        toggleSelectUnit('walk', unit, unit.moveableTiles());
    }else if(!unit.hasAttacked){
        toggleSelectUnit('attack', unit, unit.attackableTiles());
    }
}