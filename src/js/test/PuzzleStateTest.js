test( "test PuzzleState construction", function() {
    var puzzleState = new PuzzleState();
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            var expectedTile = (x + y * 3 + 1) % 9;
            equal( puzzleState.getTile(x, y), expectedTile, "Position (" + x + "," + y + ") should contain tile " + expectedTile);
        }
    }
});

test( "test PuzzleState copying from another state", function() {
    expect(0);
    // TODO
});

test( "test PuzzleState swapping of tiles", function() {
    var puzzleState = new PuzzleState();
    puzzleState.swapTiles([2,2],[0,0]);
    equal (puzzleState.getTile(0,0), 0, "Tile 0 should be in position (0,0)");
    equal (puzzleState.getTile(2,2), 1, "Tile 1 should be in position (2,2)");
});

test( "test PuzzleState swapping of tiles - out of bounds check", function() {
    expect(0);
    // TODO
});

test( "test PuzzleState setTile", function() {
    expect(0);
    // TODO
});

test( "test PuzzleState setTile - same tile value", function() {
    var puzzleState = new PuzzleState();
    var exceptions = 0;
    try {
        puzzleState.setTile(2, 2, 0);
    } catch (e) {
        exceptions++;
    }
    equal (exceptions, 0, "Setting a tile to the same value should not cause an exception");
    equal (puzzleState.getTile(2, 2), 0, "Tiles can be set to the same value");
});

test( "test PuzzleState setTile - out of bounds checks", function() {
    expect(0);
    // TODO
});

test( "test PuzzleState successors for empty tile at (0,0)", function() {
    var puzzleState = new PuzzleState();
    puzzleState.swapTiles([2,2],[0,0]);
    var successors = puzzleState.generateSuccessors();
    equal( successors.length, 2, "Empty tile in position (0,0) should produce 2 successors");
    equal( successors[0].getTile(1,0), 0, "First successor for (0,0) should have empty tile in position (1,0)");
    equal( successors[0].getTile(0,0), 2, "First successor for (0,0) should have tile 8 in position (0,0)");
    equal( successors[1].getTile(0,1), 0, "Second successor for (0,0) should have empty tile in position (0,1)");
    equal( successors[1].getTile(0,0), 4, "Second successor for (0,0) should have tile 4 in position (0,0)");
});

test( "test PuzzleState successors for empty tile at (1,1)", function() {
    // Middle (1,1)
    var puzzleState = new PuzzleState();
    puzzleState.swapTiles([2,2],[1,1]);
    var successors = puzzleState.generateSuccessors();
    equal( successors.length, 4, "Empty tile in position (1,1) should produce 4 successors");
    equal( successors[0].getTile(0,1), 0, "First successor for (1,1) should have empty tile in position (0,1)");
    equal( successors[0].getTile(1,1), 4, "First successor for (1,1) should have tile 4 in position (1,1)");
    equal( successors[1].getTile(2,1), 0, "Second successor for (1,1) should have empty tile in position (2,1)");
    equal( successors[1].getTile(1,1), 6, "Second successor for (1,1) should have tile 6 in position (1,1)");
    equal( successors[2].getTile(1,0), 0, "Third successor for (1,1) should have empty tile in position (1,0)");
    equal( successors[2].getTile(1,1), 2, "Third successor for (1,1) should have tile 2 in position (1,1)");
    equal( successors[3].getTile(1,2), 0, "Third successor for (1,1) should have empty tile in position (1,2)");
    equal( successors[3].getTile(1,1), 8, "Third successor for (1,1) should have tile 8 in position (1,1)");
});

test( "test PuzzleState successors for empty tile at (2,2)", function() {
    var puzzleState = new PuzzleState();
    var successors = puzzleState.generateSuccessors();
    equal( successors.length, 2, "Empty tile in position (2,2) should produce 2 successors");
    equal( successors[0].getTile(1,2), 0, "First successor for (2,2) should have empty tile in position (1,2)");
    equal( successors[0].getTile(2,2), 8, "First successor for (2,2) should have tile 8 in position (2,2)");
    equal( successors[1].getTile(2,1), 0, "Second successor for (2,2) should have empty tile in position (2,1)");
    equal( successors[1].getTile(2,2), 6, "Second successor for (2,2) should have tile 6 in position (2,2)");
});

test( "test PuzzleState euclidean distance heuristic", function() {
    expect(0);
});

test( "test PuzzleState manhattan distance heuristic", function() {
    expect(0);
});

test( "test PuzzleState tiles out heuristic", function() {
    expect(0);
});
