
function createApplicationStateWithMockObjects() {

    var mockInitialState = new PuzzleState();
    mockInitialState.setTiles([0,2,3,1,4,5,8,7,6]);

    var mockGoalState = new PuzzleState();
    mockGoalState.setTiles([1,2,3,4,5,0,8,7,6]);

    var MockConfiguration = Backbone.Model.extend({
        getAlgorithm: function() {
            return 'bfs';
        },
        getAvailableConfigurations: function() {
            return Configuration;
        },
        getGoalState: function() {
            return mockGoalState;
        },
        getInitialState: function() {
            return mockInitialState;
        },
        getMode: function() {
            return 'single';
        },
        setAlgorithm: function(alg) {
            this.getAlgorithm = function() {
                return alg;
            }
        },
        setGoalState: function(state) {
            this.getGoalState = function() {
                return state;
            }
        },
        setHeuristic: function(heuristic) {
            this.getHeuristic = function() {
                return heuristic;
            }
        },
        setInitialState: function(state) {
            this.getInitialState = function() {
                return state;
            }
        }
    });

    var mockConfiguration = new MockConfiguration();
    var searchTree = new SearchTree();

    // Inject mock objects into application state model
    var applicationState = new ApplicationState({
        configuration: mockConfiguration,
        searchTree: searchTree
    });

    return {
        'applicationState': applicationState,
        'availableConfigurations': Configuration,
        'configuration': mockConfiguration,
        'searchTree': searchTree
    };
}

test ("test ApplicationState construction", function() {

    var r = createApplicationStateWithMockObjects();

    equal( r.applicationState.getConfiguration(), r.configuration, "Model should use the configuration that was passed in during construction");
    equal( r.applicationState.isRunning(), false, "Application should not be running after construction");
    equal( r.applicationState.get('algorithm'), null, "Application should not have an active algorithm");
});

test ("test ApplicationState change:configuration event", function() {
    // TODO
    expect(0);
});

test ("test ApplicationState change:tree event", function() {
    // TODO
    expect(0);
});

test ("test ApplicationState start()", function() {

    var r = createApplicationStateWithMockObjects();

    // Test application state
    equal( r.applicationState.start(), r.applicationState, "start() method should allow for chaining");
    equal( r.applicationState.isRunning(), true, "Application should be running after calling start()");
    equal( r.applicationState.get('algorithm') != null, true, "Application should have an active algorithm after calling start()");

    // Test search tree root node
    var rootNode = r.applicationState.getTree().getRootNode();
    equal( rootNode != null, true, "Search tree should have a root node after calling start()");
    equal( rootNode.getState(), r.configuration.getInitialState(), "Search tree root node should point back to the initial state");
    equal( rootNode.getAttributes().hasOwnProperty('kind'), true, "Search tree root node should have an attribute named 'kind'");
});

test ("test ApplicationState next()", function() {

    var r = createApplicationStateWithMockObjects();

    try {
        r.applicationState.next();
    } catch (e) {
        equal ( typeof e, 'string', 'Calling next() before calling start() should cause an exception string to be thrown');
    }

    // Test application state
    equal( r.applicationState.start().next(), r.applicationState, "next() method should allow for chaining");
    equal( r.applicationState.isRunning(), true, "Application should continue running after calling next()");
    equal( r.applicationState.get('algorithm') != null, true, "Application should continue to have an active algorithm after calling next()");

    // Test search tree nodes
    var rootNode = r.applicationState.getTree().getRootNode();
    equal( rootNode.getState(), r.configuration.getInitialState(), "Search tree root node should point back to the initial state");
    equal( rootNode.getAttributes().hasOwnProperty('kind'), true, "Search tree root node should have an attribute named 'kind'");
    equal( rootNode.getChildCount(), 2, "Root node should have two children after first calling next()");

    // TODO: need to test identification of repeat states

    // TODO: need to test goal condition
});

test ("test ApplicationState reset()", function() {

    var r = createApplicationStateWithMockObjects();

    equal( r.applicationState.reset(), r.applicationState, "Calling reset() before calling start() should have no effect");
    equal( r.applicationState.start().next().next(), r.applicationState, "Calling start() and next() after calling reset() should not fail");
    equal( r.applicationState.reset(), r.applicationState, "reset() method should allow for chaining");
    equal( r.applicationState.get('algorithm'), null, "Application should not have an active algorithm after calling reset()");
    equal( r.applicationState.getConfiguration(), r.configuration, "Application configuration should not be affected by calling reset()");
    equal( r.applicationState.getTree().getRootNode(), null, "Search tree should not have a root node after calling reset()");
    equal( r.applicationState.isRunning(), false, "Application should not be running after calling reset()");
});
