BreadthFirstSearch = Backbone.Model.extend({

    initialize: function(attributes, options) {

        // Callback functions
        this.isGoalState = options.isGoalState;
        this.onDiscover = options.onDiscover;

        // Nodes that have been discovered
        this.closedSet = {};
        this.discoveredSet = {};
        this.discoveredSet[options.initialState.toString()] = true;

        // Number of nodes that have been explored
        this.closedCount = 0;

        // Add initial state to frontier
        this.frontier = [options.initialState];

        // Discover initial state
        options.onDiscover([{
            originalState: options.initialState,
            depth: 0,
            kind: 'normal'
        }], null);
    },

    getStatistics: function() {
        return [{
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

        var state = this.frontier.shift();

        if (this.isGoalState(state)) {
            // Let the application know that the goal has been discovered
            this.goalFound = true;
            this.onDiscover([{
                originalState: state,
                kind: 'goal'
            }], state.getParent());
            return true;
        }

        this.closedSet[state.toString()] = true;
        this.closedCount++;

        var successors = state.generateSuccessors();
        var numSuccessors = successors.length;
        var augmentedSuccessors = [];

        // Add states to the frontier
        for (var i = 0; i < numSuccessors; i++) {
            var successor = successors[i];
            var successorStr = successor.toString();

            var augmentedState = {
                originalState: successor
            }

            var checkDiscoveredList = true;
            for (var j = 0; j < this.frontier.length; j++) {
                if (this.frontier[j].toString() == successorStr) {
                    this.closedSet[this.frontier[j].toString()] = true;
                    this.closedCount++;
                    checkDiscoveredList = false;
                    augmentedState.kind = 'repeat';
                }
            }

            if (checkDiscoveredList) {
                if (this.discoveredSet.hasOwnProperty(successorStr)) {
                    augmentedState.kind = 'repeat';
                } else {
                    this.discoveredSet[successorStr] = true;
                    this.frontier.push(successor);
                    augmentedState.kind = 'normal';
                }
            }

            augmentedSuccessors.push(augmentedState);
        }

        // Let application know that states have been discovered
        this.onDiscover(augmentedSuccessors, state);

        return this.goalFound;
    },

    peek: function() {
        return this.frontier[0];
    },

    wasGoalFound: function() {
        return this.goalFound;
    }

});