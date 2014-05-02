function testSearchAlgorithm(initialState, goalState, algorithm, heuristic,
    expectedOpenListSize, expectedClosedSetSize) {

    var r = createApplicationStateWithMockObjects();

    var mockInitialState = new PuzzleState();
    mockInitialState.setTiles(initialState);
    r.applicationState.getConfiguration().setInitialState(mockInitialState);

    var mockGoalState = new PuzzleState();
    mockGoalState.setTiles(goalState);
    r.applicationState.getConfiguration().setGoalState(mockGoalState);

    r.applicationState.getConfiguration().setAlgorithm(algorithm);
    if (heuristic != null) {
        r.applicationState.getConfiguration().setHeuristic(heuristic);
    }

    r.applicationState.start(), r.applicationState;
    while (r.applicationState.isRunning()) {
        r.applicationState.next();
    }

    var stats = r.applicationState.getStatistics();
    var findStat = function(name, stats) {
        for (var i = 0; i < stats.length; i++) {
            if (stats[i].name == name) {
                return stats[i];
            }
        }
        return null;
    }

    equal(findStat('Open list', stats).value, expectedOpenListSize);
    equal(findStat('Closed list', stats).value, expectedClosedSetSize);
}

test( "test search algorithms for problem 1 (2012)", function() {
    var initialState = [3,2,4,5,0,8,7,6,1];
    var goalState = [3,6,2,5,0,4,7,1,8];
    testSearchAlgorithm(initialState, goalState, 'dfs', null, 6, 6);
    testSearchAlgorithm(initialState, goalState, 'bfs', null, 69, 132);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'tiles', 74, 114);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'euclidean', 8, 8);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'manhattan', 6, 7);
    testSearchAlgorithm(initialState, goalState, 'astar', 'tiles', 9, 11);
    testSearchAlgorithm(initialState, goalState, 'astar', 'euclidean', 8, 8);
    testSearchAlgorithm(initialState, goalState, 'astar', 'manhattan', 6, 7);
});

test( "test search algorithms for problem 2 (2012)", function() {
    var initialState = [1,2,3,4,5,0,6,7,8];
    var goalState = [1,0,3,4,2,8,6,5,7];
    testSearchAlgorithm(initialState, goalState, 'dfs', null, 5, 4);
    testSearchAlgorithm(initialState, goalState, 'bfs', null, 26, 32);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'tiles', 5, 5);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'euclidean', 8, 7);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'manhattan', 5, 5);
    testSearchAlgorithm(initialState, goalState, 'astar', 'tiles', 5, 5);
    testSearchAlgorithm(initialState, goalState, 'astar', 'euclidean', 8, 7);
    testSearchAlgorithm(initialState, goalState, 'astar', 'manhattan', 5, 5);
});

test( "test search algorithms for problem 3 (2012)", function() {
    var initialState = [0,2,3,1,5,4,8,6,7];
    var goalState = [1,2,3,5,0,4,8,6,7];
    testSearchAlgorithm(initialState, goalState, 'bfs', null, 5, 5);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'tiles', 2, 3);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'euclidean', 2, 3);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'manhattan', 2, 3);
    testSearchAlgorithm(initialState, goalState, 'astar', 'tiles', 2, 3);
    testSearchAlgorithm(initialState, goalState, 'astar', 'euclidean', 2, 3);
    testSearchAlgorithm(initialState, goalState, 'astar', 'manhattan', 2, 3);
});

test( "test search algorithms for problem 4 (2012)", function() {
    var initialState = [1,2,3,4,5,6,7,8,0];
    var goalState = [5,1,2,6,3,8,4,0,7];
    testSearchAlgorithm(initialState, goalState, 'greedy', 'tiles', 234, 394);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'euclidean', 251, 398);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'manhattan', 11, 14);
    testSearchAlgorithm(initialState, goalState, 'astar', 'tiles', 76, 104);
    testSearchAlgorithm(initialState, goalState, 'astar', 'euclidean', 40, 53);
    testSearchAlgorithm(initialState, goalState, 'astar', 'manhattan', 12, 16);
});

test( "test search algorithms for problem 5 (2012)", function() {
    var initialState = [1,0,2,5,3,8,6,4,7];
    var goalState = [1,2,3,4,5,6,7,8,0];
    testSearchAlgorithm(initialState, goalState, 'greedy', 'tiles', 193, 318);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'euclidean', 63, 78);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'manhattan', 61, 92);
    testSearchAlgorithm(initialState, goalState, 'astar', 'tiles', 582, 972);
    testSearchAlgorithm(initialState, goalState, 'astar', 'euclidean', 294, 482);
    testSearchAlgorithm(initialState, goalState, 'astar', 'manhattan', 99, 171);
});

test( "test search algorithms for problem 6 (2012)", function() {
    var initialState = [1,2,3,6,0,8,4,7,5];
    var goalState = [1,2,3,4,5,6,7,8,0];
    testSearchAlgorithm(initialState, goalState, 'greedy', 'tiles', 11, 10);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'euclidean', 11, 10);
    testSearchAlgorithm(initialState, goalState, 'greedy', 'manhattan', 9, 9);
    testSearchAlgorithm(initialState, goalState, 'astar', 'tiles', 21, 24);
    testSearchAlgorithm(initialState, goalState, 'astar', 'euclidean', 14, 16);
    testSearchAlgorithm(initialState, goalState, 'astar', 'manhattan', 10, 11);
});