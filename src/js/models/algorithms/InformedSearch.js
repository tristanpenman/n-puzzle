InformedSearch = Backbone.Model.extend({

    initialize: function(attributes, options) {

        // Callback functions
        this.isGoalState = options.isGoalState;
        this.onDiscover = options.onDiscover;
        this.heuristicFunction = options.heuristicFunction;

        // Nodes that have been explored
        this.closedSet = {};
        this.closedCount = 0;

        // Function that compares the estimated cost 'f' of a path
        var compareEntries = _.bind(function(a, b) {
            if (a.f > b.f) {
                return -1;
            } else if (a.f < b.f) {
                return 1;
            } else if (a.state.getDepth() > b.state.getDepth()) {
                return -1
            } else if (a.state.getDepth() < b.state.getDepth()) {
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

        this.frontier = new buckets.PriorityQueue(compareEntries);
        this.frontier.enqueue({
            f: this.fScoreFunction(options.initialState),
            explored: false,
            state: options.initialState
        });

        // Prepare initial state for discovery
        var augmentedInitialState = {
            originalState: options.initialState,
            depth: 0,
            kind: 'normal'
        };

        // Discover initial state
        options.onDiscover([augmentedInitialState], null);
    },

    getStatistics: function() {
        return [
            {
                name: 'Open list',
                value: this.frontier.size()
            },
            {
                name: 'Closed list',
                value: this.closedCount
            }
        ];
    },

    iterate: function() {

        if (this.goalFound) {
            return true;
        }

        // Get the highest priority node that has not been explored
        var node;
        do {
            node = this.frontier.dequeue();
        } while (node.explored == true);

        // Extract state associated with the node
        var state = node.state;

        var stateStr = state.toString()
        if (!this.closedSet.hasOwnProperty(stateStr)) {
            this.closedSet[stateStr] = true;
            this.closedCount++;

            // Find all nodes in the frontier with the same state string, and
            // mark them as explored. We also need to mark these nodes as explored
            // in the frontier, so that the search algorithm does not explore
            // it again.
            this.frontier.forEach(function(object) {
                console.log("  " + object.state.toString());
                if (object.state.toString() == stateStr) {
                    this.onDiscover([{
                        originalState: object.state,
                        kind: 'explored'
                    }], object.state.getParent());
                    object.explored = true;
                }
            });
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

        var successors = state.generateSuccessors();
        var numSuccessors = successors.length;
        var augmentedSuccessors = [];

        // Add states to the frontier
        for (var i = 0; i < numSuccessors; i++) {
            var successor = successors[i];
            successor.setHeuristicValue(this.heuristicFunction(successor));
            var successorStr = successor.toString();

            var augmentedState = {
                originalState: successor
            }

            if (this.closedSet.hasOwnProperty(successorStr)) {
                augmentedState.kind = 'repeat';
            } else {
                this.frontier.enqueue({
                    f: Math.floor(this.fScoreFunction(successor)),
                    explored: false,
                    order: i,
                    state: successor
                });
                augmentedState.kind = 'normal';
            }

            augmentedSuccessors.push(augmentedState);
        }

        // Let application know that states have been discovered
        this.onDiscover(augmentedSuccessors, state);

        return false;
    },

    peek: function() {

        var node = null;

        if (!this.frontier.isEmpty()) {
            do {
                node = this.frontier.peek();
                if (node.explored) {
                    this.frontier.dequeue();
                }
            } while (node && node.explored == true);
        }

        if (node) {
            return node.state;
        }

        return null;
    },

    wasGoalFound: function() {
        return this.goalFound;
    }

});