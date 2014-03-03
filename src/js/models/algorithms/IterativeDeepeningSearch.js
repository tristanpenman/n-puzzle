IterativeDeepeningSearch = Backbone.Model.extend({

    initialize: function(attributes, options) {

        // Callback functions
        this.isGoalState = options.isGoalState;
        this.onDiscover = options.onDiscover;
        this.onResetExpansionOrder = options.onResetExpansionOrder;

        // Nodes that have been explored
        this.closedSet = {};
        this.closedSetSize = 0;

        // Initial maximum depth is zero
        this.set('maxDepth', 0);

        // Define an initial 'augmented' state. The frontier will be reset
        // and repopulated with this state every time we begin a new iteration
        // of IDDFS.
        this.augmentedInitialState = {
            originalState: options.initialState,
            depth: 0,
            kind: 'culled'
        };

        // Add initial state to frontier
        this.openList = [];

        // Discover initial state
        options.onDiscover([this.augmentedInitialState], null);
    },

    addToClosedSet: function(state) {
        this.closedSet[state.toString()] = true;
        this.closedSetSize++;
    },

    addToOpenList: function(augmentedState) {
        this.openList.push(augmentedState);
    },

    getMaxDepth: function() {
        return this.get('maxDepth');
    },

    getNextStateFromOpenList: function() {
        return this.openList.pop();
    },

    getStatistics: function() {
        return [{
            name: 'Maximum depth',
            value: this.getMaxDepth()
        },{
            name: 'Open list',
            value: this.openList.length
        },{
            name: 'Closed list',
            value: this.closedSetSize
        }];
    },

    inClosedSet: function(state) {
        return this.closedSet.hasOwnProperty(state.toString());
    },

    inOpenList: function(state) {
        var stateStr = state.toString();
        for (var i = 0; i < this.openList.length; i++) {
            if (this.openList[i].originalState.toString() == stateStr) {
                return true;
            }
        }
        return false;
    },

    iterate: function() {

        if (this.goalFound) {
            return true;
        }

        var maxDepth = this.getMaxDepth();
        var numStates = 0;

        // If the frontier has been exhausted then the maximum depth should
        // be increased, and the search should restart at depth 0.
        if (this.openList.length == 0) {

            // Increase the max depth
            this.set('maxDepth', ++maxDepth);

            // Reset the frontier
            this.augmentedInitialState.kind = 'normal';
            this.augmentedInitialState.expansionOrder = 0;
            this.openList = [this.augmentedInitialState];
            this.closedSet = {};
            this.closedSetSize = 0;
            this.onResetExpansionOrder();
            this.onDiscover(this.openList, null);
            return false;
        }

        // As long as there are states in the frontier, and no states have
        // been added to the tree, the search should continue.
        while (this.openList.length > 0 && numStates == 0) {

            var augmentedState = this.getNextStateFromOpenList();

            if (this.isGoalState(augmentedState.originalState)) {
                // Let the application know that the goal has been discovered
                this.goalFound = true;
                this.onDiscover([{
                    originalState: augmentedState.originalState,
                    kind: 'goal',
                    depth: augmentedState.depth
                }], augmentedState.originalState.getParent());
                return true;
            }

            if (augmentedState.depth < maxDepth) {

                var parentState = augmentedState.originalState;

                // An array of successor objects with additional attributes
                var augmentedSuccessors = [];

                var successors = parentState.generateSuccessors();
                var childDepth = augmentedState.depth + 1;

                this.addToClosedSet(augmentedState.originalState);

                // Add states to the frontier
                for (var i = 0; i < successors.length; i++) {
                    var successor = successors[i];
                    var successorStr = successor.toString();

                    var childAugmentedState = {
                        originalState: successor,
                        depth: childDepth,
                        kind: 'normal'
                    };

                    if (this.inClosedSet(successor)) {
                        childAugmentedState.kind = 'repeat';
                    } else if (this.inOpenList(successor)) {
                        childAugmentedState.kind = 'repeat';
                    } else if (childAugmentedState.depth >= this.getMaxDepth()) {
                        childAugmentedState.kind = 'culled';
                    } else {
                        this.addToOpenList(childAugmentedState);
                    }

                    augmentedSuccessors.push(childAugmentedState);
                    numStates++;
                }

                this.onDiscover(augmentedSuccessors, parentState);
            }
        }

        return this.goalFound;
    },

    peek: function() {

        for (var x = this.openList.length - 1; x >= 0; x--) {
            if (this.openList[x].originalState.getDepth() < this.getMaxDepth()) {
                return this.openList[x].originalState;
            }
        }

        return null;
    },

    wasGoalFound: function() {
        return this.goalFound;
    }

});