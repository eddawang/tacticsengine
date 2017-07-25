// turn order queue
var _turnQueue = [];

// takes an array of units. puts them in the turn queue and sorts the queue
function initTurnQueue(unitList) {
    unitList.forEach(function (item) { item.curDelay = item.initDelay; _enqueueUnit(item, true); });
    _sortTurnQueue();
    _zeroTurnQueue();
}

// add unit to turn order queue. "noSort = true" if we will sort to the correct spot (based on delay) later
function _enqueueUnit(unit, noSort) {
    _turnQueue.push(unit);

    if (noSort != true) {
        _sortTurnQueue();
    }
}

// sort function to determine how the units are ordered. currently just compares delay. can update later to include secondary comparisons in case of tie
function _sortTurnQueue() {
    _turnQueue.sort(function (unit1, unit2) { return unit1.curDelay - unit2.curDelay });
}

// shifts the queue so that the first unit has zero delay
// called when we're ready for the next unit's turn
function _zeroTurnQueue() {
    var delayShift = _turnQueue[0].curDelay;
    _turnQueue.forEach(function (item) { item.curDelay -= delayShift });
}

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
//function endTurn(unit){
//    unit.endTurn();
//    //incomplete
//}

//function startTurn(unit){
//    unit.startTurn();
//    //incomplete
//}

//toggles movement + info display for first unit currently in the delay queue.
//TODO: this should be split out later so that starting the turn is not tied to movement being the first thing.
//      there should be a start turn that involves just updating the current info display. and then movement can be its own button.
//      the whole turn structure can be better encapsulated into a distinct item
function nextUnitTurn() {
    var curUnit = _turnQueue[0]
    updateInfoDisplay(curUnit);
    if (!curUnit.hasWalked) {
        toggleSelectUnit('walk', curUnit, curUnit.moveableTiles());
    }
}

//toggles basic attack mode for first unit currently in the delay queue unit
function currentUnitBasicAttack() {
    var curUnit = _turnQueue[0]
    if (!curUnit.hasAttacked) {
        toggleSelectUnit('attack', curUnit, curUnit.attackableTiles());
    }
}

//ends the turn for the first unit currently in the delay queue.
//this resets all flags, sorts the turn queue, preps the queue for the next unit's turn, and updates the display.
function endUnitTurn() {
    var curUnit = _turnQueue[0]
    curUnit.startTurn();
    resetUnitDivAttr(curUnit.id, 'hasAttacked');

    deselectAll();
    _sortTurnQueue();
    _zeroTurnQueue();
    updateDelayDisplay();
}

// updates all info displays
function updateInfoDisplay(unit) {
    updateDelayDisplay();
    document.getElementById("unitInfo").innerHTML = getUnitInfoDisplay(unit);
}

// updates the delay queue display
function updateDelayDisplay() {
    document.getElementById("delayQueue").innerHTML = getDelayQueueDisplay();
}

function getDelayQueueDisplay() {
    var display = "Delay Queue: ";

    _turnQueue.forEach(function (item) { display += "(" + item.id + ": " + item.curDelay + ") "; });

    return display;
}

function getUnitInfoDisplay(unit) {
    var display = "";

    display += "ID:" + unit.id + "<br />";

    display += "<br />"
    display += "Attack: " + unit.attack + "<br />";
    display += "Defense: " + unit.defense + "<br />";

    display += "<br />"
    display += "Movement: " + unit.movement + "<br />";
    display += "Movement Delay: " + unit.moveDelay + "<br />";

    display += "<br />"
    display += "Attack Range: " + unit.attackRange + "<br />";
    display += "Effect Range: " + unit.effectRange + "<br />";
    display += "Attack Delay: " + unit.attackDelay + "<br />";

    display += "<br />"
    display += "Moveable Terrain: " + unit.moveableTerrain + "<br />";

    display += "<br />"
    display += "HP: " + unit.hp + "<br />";
    display += "Initial Delay: " + unit.initDelay + "<br />";
    display += "Current Delay: " + unit.curDelay + "<br />";

    return display;
}