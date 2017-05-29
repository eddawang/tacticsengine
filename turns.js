//End turn for entire team
//used if the turn structure is such that any unit can go on player's turn
function endTeamTurn(team, map){
    for(var i in map.units){
        var u = map.units[i];
        if(u.team == team){
            u.endTurn();
            setUnitDivAttr(u.id, {hasAttacked:u.hasAttacked});
        }
    }
}

function startTeamTurn(team, map){
    for(var i in map.units){
        var u = map.units[i];
        if(u.team == team){
         u.startTurn();
         resetUnitDivAttr(u.id, 'hasAttacked');
        }
    }
}

//Used when units take turns based on some order
//Currently incomplete
function endTurn(unit){
    unit.endTurn();
    //incomplete
}

function startTurn(unit){
    unit.startTurn();
    //incomplete
}