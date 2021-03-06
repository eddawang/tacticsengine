function drawMoveUnit(unitId, loc){
    $('#'+unitId).appendTo(idSelect(loc));
}

function setUnitDivAttr(unitId, attr){
    $('#'+unitId).attr(attr)
}
function resetUnitDivAttr(unitId, attrName){
    $('#'+unitId).removeAttr(attrName);
}

function damageToast(unit, damage){
    $('#'+unit.id).append(div({class:'toast'}, damage));
    console.log(unit.id+":"+unit.hp+" hp left.");
    setTimeout(function(){$('#'+unit.id+">.toast").remove()},1500);
}


//Converts id into a selectable string for jquery
function idSelect(text){
    return '#'+$.escapeSelector(text);
}

//Applies attributes to tiles in range
function setRange(tileRange, attr){
    for(var i in tileRange)
        $(idSelect(tileRange[i].loc)).attr(attr);
}
function unsetRange(tileRange, attrName){
    for(var i in tileRange)
        $(idSelect(tileRange[i].loc)).removeAttr(attrName);
}

/////////////////////////////////////////////////////////
//Called once initially to create unit divs
function _drawUnits(map){
    for(var i in map.units){
        var u = map.units[i];
        var selector = idSelect(u.tile.loc);
        var team = u.team==2?'enemy':u.team==1?'ally':'neutral';
        var attrib = {class:'unit', id:"'"+u.id+"'", team:team};
        var d = element('div',attrib, u.id);
        $(selector).append(d);
        u.div = d;
    }
}

//Called once initially after map is created tile divs
function _drawMap(container, map){
    for(var j=0; j<map.height; j++){
        $(container).append(div({class:'tileRow', id:'row'+j}));
        for(var i=0; i<map.width; i++){
            var t = map[getLoc(i,j)];
            divTile('#row'+j,t);
        }
    }
}
////////////////////////////////////////////////////////

//Creates div of Tile inside selected div
function divTile(selector, tile){
    if(tile){
        var loc = tile.loc;
        var terrain = tile.terrain;
    }else{
        var loc = '';
        var terrain = 'blank';
    }
    $(selector).append(div({class:'tile', id:loc, terrain:terrain}, '', {'--loc':"'"+loc+"'"}));
}

//Creates div string
function div(attrib, content, css){
    return element('div',attrib,content,css);
}

//Creates an element string
function element(element, attrib, content, css){
    var elem = '<'+element+' ';
    for(var i in attrib){
        elem+=i+'='+attrib[i]+' ';
    }
    if(css){
        elem+='style="';
        for(var i in css){
            elem+=i+':'+css[i]+';';
        }
        elem+='"';
    }
    if(!content)
        content='';
    elem+='>'+content+'</'+element+'>';
    return elem;
}