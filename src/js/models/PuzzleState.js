PuzzleState = Backbone.Model.extend({

    initialize: function(attributes, options) {
        this.tiles = [1,2,3,4,5,6,7,8,0];
        this.depth = 0;
        this.expansionOrder = 0;
        this.heuristicValue = null;
        if (options != null) {
            this.parent = options.parent;
            if (this.parent != null) {
                this.copyFrom(this.parent);
                this.depth = this.parent.depth + 1;
            }
        }
    },

    copyFrom: function(src) {

        if (src.hasOwnProperty('tiles') && $.isArray(src.tiles) && src.tiles.length == 9) {
            this.tiles = src.tiles.slice();
            this.trigger('change');
            return this;
        }

        throw "Invalid source state";
    },

    generateSuccessors: function() {
        var successors = [];
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                if (this.tiles[x + y * 3] == 0) {
                    var zero = [x, y];
                    if (x > 0) {
                        var newState = new PuzzleState({}, {parent: this});
                        newState.swapTiles(zero, [x - 1, y]);
                        successors.push(newState);
                    }
                    if (x < 2) {
                        var newState = new PuzzleState({}, {parent: this});
                        newState.swapTiles(zero, [x + 1, y]);
                        successors.push(newState);
                    }
                    if (y > 0) {
                        var newState = new PuzzleState({}, {parent: this});
                        newState.swapTiles(zero, [x, y - 1]);
                        successors.push(newState);
                    }
                    if (y < 2) {
                        var newState = new PuzzleState({}, {parent: this});
                        newState.swapTiles(zero, [x, y + 1]);
                        successors.push(newState);
                    }

                    return successors;
                }
            }
        }

        throw "Failed to generate successors.";
    },

    getDepth: function() {
        return this.depth;
    },

    getExpansionOrder: function() {
        return this.expansionOrder;
    },

    getHeuristicValue: function() {
        return this.heuristicValue;
    },

    /**
     *  Returns an identifier that represents the path followed to reach the
     *  given state.
     *
     *  @param  state  the state whose identifier should be constructed
     *
     *  @return a string that can be used to identifier the state
     */
    getLongIdentifier: function() {
        var s = this.toString();
        var p = this.getParent();
        while (p != null) {
            s = p.toString() + ':' + s;
            p = p.getParent();
        }
        return s;
    },

    getParent: function() {
        return this.parent;
    },

    getTile: function(x, y) {

        if (x < 0 || x > 2 || y < 0 || y > 2) {
            throw "Tile position is out of bounds.";
        }

        return this.tiles[x + y * 3];
    },

    isEqualTo: function(other) {
        if (typeof other == typeof this) {
            return other.toString() === this.toString();
        }
        return false;
    },

    setExpansionOrder: function(value) {
        this.expansionOrder = value;
    },

    setHeuristicValue: function(value) {
        this.heuristicValue = value;
    },

    setTile: function(x, y, tile) {

        if (x < 0 || x > 2 || y < 0 || y > 2) {
            throw "Tile position is out of bounds.";
        }

        if (tile < 0 || tile > 8) {
            throw "Tile value is out of bounds.";
        }

        // If the current tile value is the same as the one that will be set
        // we can return early.
        var current = this.tiles[x + y * 3];
        if (current == tile) {
            return;
        }

        // Find where the tile value has been used previously and replace that
        // tile's value with the previous value of the current tile
        for (var dx = 0; dx < 3; dx++) {
            for (var dy = 0; dy < 3; dy++) {
                if (this.tiles[dx + dy * 3] == tile) {
                    this.tiles[dx + dy * 3] = current;
                    this.tiles[x + y * 3] = tile;
                    this.trigger('change');
                    return this;
                }
            }
        }

        // An error occurred while trying to re-assign the previous value of
        // this tile to the available location.
        throw ("Failed to set tile at (" + x + "," + y + ") to " + tile);
    },

    setTiles: function(tiles) {
        if (tiles.length != 9) {
            throw "Tile array must have a length of 9.";
        }

        // Validate input
        var valuesUsed = [];
        for (var i = 0; i < 9; i++) {
            var newTile = tiles[i];
            if (Util.isInteger(newTile) && newTile >= 0 && newTile <= 8) {
                if (valuesUsed.indexOf(tiles[i]) == -1) {
                    valuesUsed.push(tiles[i]);
                    continue;
                }
            }

            throw "Tile array must use all the values 0 through 8 exactly once each.";
        }

        for (var i = 0; i < 9; i++) {
            this.tiles[i] = tiles[i];
        }

        this.trigger('change');
    },

    swapTiles: function(a, b) {

        if (a[0] < 0 || a[0] > 2 || a[1] < 0 || a[1] > 2) {
            throw "Tile position for first tile is out of bounds.";
        }

        if (b[0] < 0 || b[0] > 2 || b[1] < 0 || b[1] > 2) {
            throw "Tile position for first tile is out of bounds.";
        }

        var tmp = this.tiles[a[0] + a[1] * 3];
        this.tiles[a[0] + a[1] * 3] = this.tiles[b[0] + b[1] * 3];
        this.tiles[b[0] + b[1] * 3] = tmp;

        this.trigger('change');
        return this;
    },

    toString: function() {
        return this.tiles.toString();
    },

    valueOf: function() {
        return this.tiles.valueOf();
    }

});

PuzzleState.calculateEuclideanDistance = function(a, b) {
    var distance = 0;
    // For each tile in puzzle state 'a'
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            // Find the matching tile in puzzle state 'b'
            var found = false;
            for (var dy = 0; dy < 3; dy++) {
                for (var dx = 0; dx < 3; dx++) {
                    if (a.getTile(x, y) == b.getTile(dx, dy)) {
                        // Then add the distance between the tiles' positions
                        var h = Math.abs(dx - x);
                        var v = Math.abs(dy - y);
                        distance += Math.floor(Math.sqrt(v*v + h*h));
                        found = true;
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }
        }
    }
    return distance;
};

PuzzleState.calculateManhattanDistance = function(a, b) {
    var distance = 0;
    // For each tile in puzzle state 'a'
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            if (a.getTile(x, y) != 0) {
                // Find the matching tile in puzzle state 'b'
                var found = false;
                for (var dy = 0; dy < 3; dy++) {
                    for (var dx = 0; dx < 3; dx++) {
                        if (a.getTile(x, y) == b.getTile(dx, dy)) {
                            distance += Math.abs(dx - x);
                            distance += Math.abs(dy - y);
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        break;
                    }
                }
            }
        }
    }
    return distance;
};

PuzzleState.calculateTilesOutOfPlace = function(a, b) {
    var tilesOutOfPlace = 0;
    // For each tile in puzzle state 'a'
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            var tile = a.getTile(x, y);
            if (tile != 0) {
                if (tile != b.getTile(x, y)) {
                    tilesOutOfPlace++;
                }
            }
        }
    }
    return tilesOutOfPlace;
};
