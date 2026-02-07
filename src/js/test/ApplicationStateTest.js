import Backbone from 'backbone';
import { test } from 'qunit';

import ApplicationState from '../models/ApplicationState';
import Configuration from '../models/Configuration';
import PuzzleState from '../models/PuzzleState';
import SearchTree from '../models/SearchTree';

export function createApplicationStateWithMockObjects() {
  const mockInitialState = new PuzzleState();
  mockInitialState.setTiles([0, 2, 3, 1, 4, 5, 8, 7, 6]);

  const mockGoalState = new PuzzleState();
  mockGoalState.setTiles([1, 2, 3, 4, 5, 0, 8, 7, 6]);

  const MockConfiguration = Backbone.Model.extend({
    getAlgorithm: () => {
      return 'bfs';
    },
    getAvailableConfigurations: () => {
      return Configuration;
    },
    getGoalState: () => {
      return mockGoalState;
    },
    getInitialState: () => {
      return mockInitialState;
    },
    getMode: () => {
      return 'single';
    },
    setAlgorithm: function (alg) {
      this.getAlgorithm = () => {
        return alg;
      }
    },
    setGoalState: function (state) {
      this.getGoalState = () => {
        return state;
      }
    },
    setHeuristic: function (heuristic) {
      this.getHeuristic = () => {
        return heuristic;
      }
    },
    setInitialState: function (state) {
      this.getInitialState = () => {
        return state;
      }
    }
  });

  const mockConfiguration = new MockConfiguration();
  const searchTree = new SearchTree();

  // Inject mock objects into application state model
  const applicationState = new ApplicationState({
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

test("test ApplicationState construction", (assert) => {
  const r = createApplicationStateWithMockObjects();

  assert.equal(r.applicationState.getConfiguration(), r.configuration, "Model should use the configuration that was passed in during construction");
  assert.equal(r.applicationState.isRunning(), false, "Application should not be running after construction");
  assert.equal(r.applicationState.get('algorithm'), null, "Application should not have an active algorithm");
});

test("test ApplicationState change:configuration event", (assert) => {
  // TODO
  assert.expect(0);
});

test("test ApplicationState change:tree event", (assert) => {
  // TODO
  assert.expect(0);
});

test("test ApplicationState start()", (assert) => {
  const r = createApplicationStateWithMockObjects();

  // Test application state
  assert.equal(r.applicationState.start(), r.applicationState, "start() method should allow for chaining");
  assert.equal(r.applicationState.isRunning(), true, "Application should be running after calling start()");
  assert.equal(r.applicationState.get('algorithm') != null, true, "Application should have an active algorithm after calling start()");

  // Test search tree root node
  const rootNode = r.applicationState.getTree().getRootNode();
  assert.equal(rootNode != null, true, "Search tree should have a root node after calling start()");
  assert.equal(rootNode.getState(), r.configuration.getInitialState(), "Search tree root node should point back to the initial state");
  assert.equal(rootNode.getAttributes().hasOwnProperty('kind'), true, "Search tree root node should have an attribute named 'kind'");
});

test("test ApplicationState next()", (assert) => {
  const r = createApplicationStateWithMockObjects();

  try {
    r.applicationState.next();
  } catch (e) {
    assert.equal(typeof e, 'string', 'Calling next() before calling start() should cause an exception string to be thrown');
  }

  // Test application state
  assert.equal(r.applicationState.start().next(), r.applicationState, "next() method should allow for chaining");
  assert.equal(r.applicationState.isRunning(), true, "Application should continue running after calling next()");
  assert.equal(r.applicationState.get('algorithm') != null, true, "Application should continue to have an active algorithm after calling next()");

  // Test search tree nodes
  const rootNode = r.applicationState.getTree().getRootNode();
  assert.equal(rootNode.getState(), r.configuration.getInitialState(), "Search tree root node should point back to the initial state");
  assert.equal(rootNode.getAttributes().hasOwnProperty('kind'), true, "Search tree root node should have an attribute named 'kind'");
  assert.equal(rootNode.getChildCount(), 2, "Root node should have two children after first calling next()");

  // TODO: need to test identification of repeat states

  // TODO: need to test goal condition
});

test("test ApplicationState reset()", (assert) => {
  const r = createApplicationStateWithMockObjects();

  assert.equal(r.applicationState.reset(), r.applicationState, "Calling reset() before calling start() should have no effect");
  assert.equal(r.applicationState.start().next().next(), r.applicationState, "Calling start() and next() after calling reset() should not fail");
  assert.equal(r.applicationState.reset(), r.applicationState, "reset() method should allow for chaining");
  assert.equal(r.applicationState.get('algorithm'), null, "Application should not have an active algorithm after calling reset()");
  assert.equal(r.applicationState.getConfiguration(), r.configuration, "Application configuration should not be affected by calling reset()");
  assert.equal(r.applicationState.getTree().getRootNode(), null, "Search tree should not have a root node after calling reset()");
  assert.equal(r.applicationState.isRunning(), false, "Application should not be running after calling reset()");
});
