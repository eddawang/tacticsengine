//Testing purposes
//_genSquareMap(20,20,_map);
var _map = {};
_map.units = {};

/*
//Test performance of functions
var a = performance.now();
var test1 = traverseCross(3, _map["8,8"], 1);
var b = performance.now();
console.log(b-a);
*/


// Static Functions

function getLoc(x,y){
    return x+","+y;
}

function _genSquareMap(width, height,map){
    for(var i=0;i<width;i++){
        for(var j=0;j<height;j++){
            new tile(i,j,'grass',map);
        }
    }
    map.width = width;
    map.height = height;
}



// Tile Object
function tile(x, y, terrain, map){
    this.loc = getLoc(x,y);
    this.terrain = terrain;
    
    this.onTile;
    
    //Initialize neighbors
    if(map){
        map[this.loc] = this;
        if(map[(x-1)+","+y]){
            this.left = map[(x-1)+","+y];
            this.left.right = this;
        }
        if(map[(x+1)+","+y]){
            this.right = map[(x+1)+","+y];
            this.right.left = this;
        }
        if(map[x+","+(y-1)]){
            this.up = map[x+","+(y-1)];
            this.up.down = this;
        }
        if(map[x+","+(y+1)]){
            this.down = map[x+","+(y+1)];
            this.down.up = this;
        }
    }
}

/*Traverse Functions
    All traverse functions return an object containing:
    {
        tiles: tiles traversed
        onTiles: units that are on the tiles traversed
    }
    
    Paramaters:
        range -- integer indicating distance to search
        tile -- tile object indicating start location for search
        direction -- 'left', 'right', 'up', 'down'
        target -- boolean value indicating whether or not to include start location in results

    Search ends if there is no tile
        -including gaps that might be on the map
        -which is why gaps should still have a tile
*/

function traverseDirection(range, tile, direction, target){
    var tiles = [];
    var onTiles = [];
    if(target){
        tiles.push(tile);
        if(tile.onTile)
            onTiles.push(tile.onTile);
    }
    while(range--){
        var t = tile[direction];
        if(t){
            tiles.push(t)
            if(t.onTile)
                onTiles.push(t.onTile);
            tile = t;
        }
    }
    return {tiles: tiles, onTiles: onTiles};
}

/*
    Searches in '+' shape. Can probably modify so that it searches in any of
    four directions based on an argument.
*/

function traverseCross(range, tile, target){
    var tiles = [];
    var onTiles = [];
    if(target){
        tiles.push(tile);
        if(tile.onTile)
            onTiles.push(tile.onTile);
    }
    
    var left = tile;
    var right = tile;
    var up = tile;
    var down = tile;

    while(range--){
        var l = left.left;
        var r = right.right;
        var d = down.down;
        var u = up.up;
        if(l){
            tiles.push(l)
            if(l.onTile)
                onTiles.push(l.onTile);
            left = l;
        }
        if(r){
            tiles.push(r)
            if(r.onTile)
                onTiles.push(r.onTile);
            right = r;
        }
        if(d){
            tiles.push(d)
            if(d.onTile)
                onTiles.push(d.onTile);
            down = d;
        }
        if(u){
            tiles.push(u)
            if(u.onTile)
                onTiles.push(u.onTile);
            up = u;
        }
    }
    return {tiles: tiles, onTiles: onTiles};
}

//Real traversal limited by walking only through allowed terrain up to range
//  terrain should be a string containing all the allowable terrains
//  e.g. "grass,lava,sand"
//  used for walking ranges
function trueTraverse(range, tile, terrain, team){
    var tiles = {};
    var onTiles = [];
    
    var boundary = [tile];
    for(var i=0;i<range;i++){
        var b = []; // Holds tiles to start search from for next iteration
        //Searches out from each tile in boundary
        for(var j in boundary){
            var t = boundary[j];
            //Search up
            var nextTile = t.up;
            //Check if tile meets criteria and whether already been searched
            //  also makes sure it's not the starting target cell
            if(nextTile && !tiles[nextTile.loc] && nextTile!=tile){
                if(terrain.includes(nextTile.terrain) && (!nextTile.onTile || nextTile.onTile.team == team)){//Checking criteria here
                    tiles[nextTile.loc] = nextTile;
                    b.push(nextTile); //saves tile for next iteration
                    if(nextTile.onTile)
                        onTiles.push(nextTile.onTile);
                }
            }
            //Search down
            nextTile = t.down;
            if(nextTile && !tiles[nextTile.loc] && nextTile!=tile){
                if(terrain.includes(nextTile.terrain) && (!nextTile.onTile || nextTile.onTile.team == team)){
                    tiles[nextTile.loc] = nextTile;
                    b.push(nextTile); //saves tile for next iteration
                    if(nextTile.onTile)
                        onTiles.push(nextTile.onTile);
                }
            }
            //Search Left
            nextTile = t.left;
            if(nextTile && !tiles[nextTile.loc] && nextTile!=tile){
                if(terrain.includes(nextTile.terrain) && (!nextTile.onTile || nextTile.onTile.team == team)){
                    tiles[nextTile.loc] = nextTile;
                    b.push(nextTile); //saves tile for next iteration
                    if(nextTile.onTile)
                        onTiles.push(nextTile.onTile);
                }
            }
            //Search Right
            nextTile = t.right;
            if(nextTile && !tiles[nextTile.loc] && nextTile!=tile){
                if(terrain.includes(nextTile.terrain) && (!nextTile.onTile || nextTile.onTile.team == team)){
                    tiles[nextTile.loc] = nextTile;
                    b.push(nextTile); //saves tile for next iteration
                    if(nextTile.onTile)
                        onTiles.push(nextTile.onTile);
                }
            }
        }
        //Updates the boundary to new boundaries
        boundary = b;
    }
    return {tiles: tiles, onTiles: onTiles};
}


//Typically should only be used for skill ranges
// is not a true traversal but grabs the tiles efficiently
function traverseRadial(range, tile, target){
    var tiles = [];
    var onTiles = [];
    if(target){
        tiles.push(tile);
        if(tile.onTile)
            onTiles.push(tile.onTile);
    }
    
    var left, right, left2, right2, dist;
    var up = tile;
    var down = tile;

    while(dist=range--){
        left = up;
        right = up;
        left2 = down;
        right2 = down;
        var part = true;
        if(left==left2)
            part=false;
            
        while(dist--){
            var l,r;
            //traverse horizontally as 'up' traverses upwards
            if(left)
                l = left.left;
            if(right)
                r = right.right;
            
            //traversal
            if(l){
                tiles.push(l)
                if(l.onTile)
                    onTiles.push(l.onTile);
                left = l;
            }
            if(r){
                tiles.push(r)
                if(r.onTile)
                    onTiles.push(r.onTile);
                right = r;
            }
            
            l,r = undefined;
            //Checks if initial loop
            if(part){
                //traverses horizontally as 'down' traverses downwards
                if(left2)
                    l = left2.left;
                if(right2)
                    r = right2.right;
            }else{
                //traverses vertical column for initial loop
                l = left2.up;
                r = right2.down;
            }
            
            //traversal
            if(l){
                tiles.push(l)
                if(l.onTile)
                    onTiles.push(l.onTile);
                left2 = l;
            }
            if(r){
                tiles.push(r)
                if(r.onTile)
                    onTiles.push(r.onTile);
                right2 = r;
            }
        }
        
        //traverses 'up' and 'down'
        if(up)
            up = up.up;
        if(down)
            down = down.down;
    }
    return {tiles: tiles, onTiles: onTiles};
}