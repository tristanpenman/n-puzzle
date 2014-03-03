DepthFirstSearch = Backbone.Model.extend({

    initialize: function(attributes, options) {

        // Callback functions
        this.isGoalState = options.isGoalState;
        this.onDiscover = options.onDiscover;

        // Nodes that have been explored
        this.closedList = {};
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

        var state = this.frontier.pop();

        if (this.isGoalState(state)) {
            // Let the application know that the goal has been discovered
            this.goalFound = true;
            this.onDiscover([{
                originalState: state,
                kind: 'goal'
            }], state.getParent());
            return true;
        }

        var stateStr = state.toString()
        if (this.closedList.hasOwnProperty(stateStr)) {
            return false;
        } else {
            this.closedList[stateStr] = true;
            this.closedCount++;
        }

        var successors = state.generateSuccessors();
        var numSuccessors = successors.length;
        var augmentedSuccessors = [];

        // Add states to the frontier
        for (var i = 0; i < numSuccessors; i++) {
            var successor = successors[i];
            var successorStr = successor.toString();

            var augmentedState = {
                originalState: successor,
                kind: 'normal'
            };

            if (this.closedList.hasOwnProperty(successorStr)) {
                augmentedState.kind = 'repeat';
            } else {
                this.frontier.push(successor);
            }

            augmentedSuccessors.push(augmentedState);
        }

        // Let application know that states have been discovered
        this.onDiscover(augmentedSuccessors, state);

        return this.goalFound;
    },

    peek: function() {
        return this.frontier[this.frontier.length - 1];
    },

    wasGoalFound: function() {
        return this.goalFound;
    }

});