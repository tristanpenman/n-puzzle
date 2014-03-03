BreadthFirstSearch = Backbone.Model.extend({

    initialize: function(attributes, options) {

        // Callback functions
        this.isGoalState = options.isGoalState;
        this.onDiscover = options.onDiscover;

        // Nodes that have been discovered
        this.closedSet = {};
        this.closedSetSize = 0;

        // Add initial state to frontier
        this.openList = [options.initialState];

        // Discover initial state
        options.onDiscover([{
            originalState: options.initialState,
            depth: 0,
            kind: 'normal'
        }], null);
    },

    addToClosedSet: function(state) {
        this.closedSet[state.toString()] = true;
        this.closedSetSize++;
    },

    addToOpenList: function(state) {
        this.openList.push(state);
    },

    getNextStateFromOpenList: function() {
        return this.openList.shift();
    },

    getStatistics: function() {
        return [{
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
            if (this.openList[i].toString() == stateStr) {
                return true;
            }
        }

        return false;
    },

    iterate: function() {

        if (this.goalFound) {
            return true;
        }

        var state = this.getNextStateFromOpenList();

        if (this.isGoalState(state)) {
            // Let the application know that the goal has been discovered
            this.goalFound = true;
            this.onDiscover([{
                originalState: state,
                kind: 'goal'
            }], state.getParent());
            return true;
        }

        this.addToClosedSet(state);

        var successors = state.generateSuccessors();
        var numSuccessors = successors.length;
        var augmentedSuccessors = [];

        // Add states to the frontier
        for (var i = 0; i < numSuccessors; i++) {

            var successor = successors[i];
            var augmentedState = {
                originalState: successor
            }

            if (this.inOpenList(successor)) {
                this.addToClosedSet(successor);
                augmentedState.kind = 'repeat';
            } else if (this.inClosedSet(successor)) {
                augmentedState.kind = 'repeat';
            } else {
                this.addToOpenList(successor);
                augmentedState.kind = 'normal';
            }

            augmentedSuccessors.push(augmentedState);
        }

        // Let application know that states have been discovered
        this.onDiscover(augmentedSuccessors, state);

        return this.goalFound;
    },

    peek: function() {
        if (this.openList.length > 0) {
            return this.openList[0];
        } else {
            return null;
        }
    },

    wasGoalFound: function() {
        return this.goalFound;
    }

});