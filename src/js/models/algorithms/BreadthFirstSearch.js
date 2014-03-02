BreadthFirstSearch = Backbone.Model.extend({

    initialize: function(attributes, options) {

        // Callback functions
        this.isGoalState = options.isGoalState;
        this.onDiscover = options.onDiscover;

        // Discovered nodes
        this.discovered = {};
        this.discovered[options.initialState.toString()] = true;

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

        var successors = state.generateSuccessors();
        this.closedCount++;
        var numSuccessors = successors.length;
        var augmentedSuccessors = [];

        // Add states to the frontier
        for (var i = 0; i < numSuccessors; i++) {
            var successor = successors[i];
            var successorStr = successor.toString();

            var augmentedState = {
                originalState: successor
            }

            if (this.discovered.hasOwnProperty(successorStr)) {
                augmentedState.kind = 'repeat';
            } else {
                this.discovered[successorStr] = true;
                this.frontier.push(successor);
                augmentedState.kind = 'normal';
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