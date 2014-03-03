IterativeDeepeningSearch = Backbone.Model.extend({

    initialize: function(attributes, options) {

        // Callback functions
        this.isGoalState = options.isGoalState;
        this.onDiscover = options.onDiscover;

        // Nodes that have been discovered
        this.discoveredList = {};
        this.discoveredList[options.initialState.toString()] = true;

        // Number of nodes that have been explored
        this.closedCount = 0;

        // Initial maximum depth is zero
        this.set('maxDepth', 0);

        // Define an initial 'augmented' state. The frontier will be reset
        // and repopulated with this state every time we begin a new iteration
        // of IDDFS.
        this.augmentedInitialState = {
            originalState: options.initialState,
            depth: 0,
            kind: 'normal'
        };

        // Add initial state to frontier
        this.frontier = [this.augmentedInitialState];

        // Discover initial state
        options.onDiscover([this.augmentedInitialState], null);
    },

    getMaxDepth: function() {
        return this.get('maxDepth');
    },

    getStatistics: function() {
        return [{
            name: 'Maximum depth',
            value: this.getMaxDepth()
        },{
            name: 'Open list',
            value: this.frontier.length
        },{
            name: 'Closed list',
            value: this.closedCount
        }];
    },

    iterate: function() {

        if (this.goalFound) {
            return true;
        }

        var maxDepth = this.getMaxDepth();
        var numStates = 0;

        // As long as there are states in the frontier, and no states have
        // been added to the tree, the search should continue.
        while (this.frontier.length > 0 && numStates == 0) {

            var augmentedState = this.frontier.pop();

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

                var parentState = augmentedState.originalState
                var successors = parentState.generateSuccessors();
                var childDepth = augmentedState.depth + 1;

                this.closedCount++;

                // An array of successor objects with additional attributes
                var augmentedSuccessors = [];

                // Add states to the frontier
                for (var i = 0; i < successors.length; i++) {
                    var successor = successors[i];
                    var successorStr = successor.toString();

                    var childAugmentedState = {
                        originalState: successor,
                        depth: childDepth
                    };

                    var isRepeat = this.discoveredList.hasOwnProperty(successorStr);

                    if (isRepeat) {
                        childAugmentedState.kind = 'repeat';
                    } else {
                        childAugmentedState.kind = 'normal';
                        this.discoveredList[successorStr] = true;
                        this.frontier.push(childAugmentedState);
                    }

                    augmentedSuccessors.push(childAugmentedState);
                }

                this.onDiscover(augmentedSuccessors, parentState);

                numStates += augmentedSuccessors.length;
            }
        }

        // If the frontier has been exhausted then the maximum depth should
        // be increased, and the search should restart at depth 0.
        if (this.frontier.length == 0) {

            // Increase the max depth
            this.set('maxDepth', ++maxDepth);

            // Reset the frontier
            this.frontier = [this.augmentedInitialState];
            this.discoveredList = {};
            this.closedCount = 0;
            this.onDiscover([this.augmentedInitialState], null);
        }

        return this.goalFound;
    },

    peek: function() {

        for (var x = this.frontier.length - 1; x >= 0; x--) {
            if (this.frontier[x].originalState.getDepth() < this.getMaxDepth()) {
                return this.frontier[x].originalState;
            }
        }

        return null;
    },

    wasGoalFound: function() {
        return this.goalFound;
    }

});