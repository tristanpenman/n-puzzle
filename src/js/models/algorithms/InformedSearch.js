import Backbone from 'backbone';
import buckets from 'buckets-js';
import _ from 'underscore';

const InformedSearch = Backbone.Model.extend({
  initialize: function (attributes, options) {
    // Callback functions
    this.isGoalState = options.isGoalState;
    this.onDiscover = options.onDiscover;
    this.heuristicFunction = options.heuristicFunction;
    this.onChangeKind = options.onChangeKind;

    // Nodes that have been explored
    this.closedSet = {};
    this.closedSetSize = 0;

    this.nonce = 0;

    // Function that compares the estimated cost 'f' of a path
    const compareEntries = _.bind(function (a, b) {
      if (a.f > b.f) {
        return -1;
      } else if (a.f < b.f) {
        return 1;
      } else if (a.order > b.order) {
        return -1;
      } else if (a.order < b.order) {
        return 1;
      }
      return 0;
    }, this);

    options.initialState.setHeuristicValue(
      options.heuristicFunction(options.initialState));

    // Nodes that are in the open list
    this.openList = new buckets.PriorityQueue(compareEntries);
    this.openList.enqueue({
      f: this.fScoreFunction(options.initialState),
      explored: false,
      state: options.initialState
    });

    // Prepare initial state for discovery
    const augmentedInitialState = {
      originalState: options.initialState,
      depth: 0,
      kind: 'normal'
    };

    // Discover initial state
    options.onDiscover([augmentedInitialState], null);
  },

  getStatistics: function () {
    return [
      {
        name: 'Open list',
        value: this.openList.size()
      },
      {
        name: 'Closed list',
        value: this.closedSetSize
      }
    ];
  },

  inOpenList: function (state) {
    const stateStr = state.toString();
    let result = false;
    this.openList.forEach(_.bind(function (object) {
      if (object.state.toString() == stateStr) {
        result = true;
        return false;
      }
    }, this));
    return result;
  },

  iterate: function () {
    if (this.goalFound) {
      return true;
    }

    const expectedNode = this.peek();

    // Get the highest priority node that has not been explored
    let node;
    do {
      node = this.openList.dequeue();
    } while (node.explored == true);

    if (node.state.toString() != expectedNode.toString()) {
      alert(node.state.toString() + " " + expectedNode.toString());
    }

    // Extract state associated with the node
    const state = node.state;
    const stateStr = state.toString();

    // Keep track of any nodes whose states have been explored via
    // other nodes in the tree
    const explored = [];

    this.closedSetSize++;
    if (!Object.prototype.hasOwnProperty.call(this.closedSet, stateStr)) {
      this.closedSet[stateStr] = true;

      // Find all nodes in the frontier with the same state string, and
      // mark them as explored. We also need to mark these nodes as explored
      // in the frontier, so that the search algorithm does not explore
      // it again.
      this.openList.forEach(_.bind(function (object) {
        if (object.state.toString() == stateStr) {
          explored.push(object.state);
          object.explored = true;
          this.closedSetSize++;
        }
      }, this));
    }

    if (this.isGoalState(state)) {
      // Let the application know that the goal has been discovered
      this.goalFound = true;
      this.onDiscover([{
        originalState: state,
        kind: 'goal'
      }], state.getParent());
      return true;
    }

    const successors = state.generateSuccessors();
    const numSuccessors = successors.length;
    const augmentedSuccessors = [];

    // Add states to the frontier
    for (let i = 0; i < numSuccessors; i++) {
      const successor = successors[i];
      successor.setHeuristicValue(this.heuristicFunction(successor));
      const successorStr = successor.toString();

      const augmentedState = {
        originalState: successor
      }

      if (this.inOpenList(successor)) {
        this.closedSetSize++;
        this.closedSet[successorStr] = true;
        augmentedState.kind = 'repeat';
      } else if (Object.prototype.hasOwnProperty.call(this.closedSet, successorStr)) {
        augmentedState.kind = 'repeat';
      } else {
        augmentedState.kind = 'normal';
        this.openList.enqueue({
          f: Math.floor(this.fScoreFunction(successor)),
          explored: false,
          order: this.nonce++,
          state: successor
        });
      }

      augmentedSuccessors.push(augmentedState);
    }

    // Let application know that states have been discovered
    this.onDiscover(augmentedSuccessors, state, explored);

    return false;
  },

  peek: function () {
    let node = null;
    do {
      if (this.openList.isEmpty()) {
        node = null;
      } else {
        node = this.openList.peek();
        if (node.explored) {
          this.openList.dequeue();
        }
      }
    } while (node && node.explored == true);

    if (node) {
      return node.state;
    }

    return null;
  },

  wasGoalFound: function () {
    return this.goalFound;
  }
});

export default InformedSearch;
