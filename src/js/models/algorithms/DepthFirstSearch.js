DepthFirstSearch = Backbone.Model.extend({
	
	initialize: function(attributes, options) {
		
		// Callback functions
		this.isGoalState = options.isGoalState;
		this.onDiscover = options.onDiscover;
		this.storeExploredStates = options.storeExploredStates
		if (this.storeExploredStates) {
			// Discovered nodes
			this.discovered = {};
			this.discovered[options.initialState.toString()] = true;
			
			// Number of explored nodes
			this.closedCount = 0;			
		}

		// Prepare initial state for discovery
		var augmentedInitialState = {
			originalState: options.initialState,
			depth: 0,
			kind: 'normal'
		};
		
		// Check whether or not initial state is a goal 
		this.goalFound = this.isGoalState(options.initialState);
		if (this.goalFound) {
			this.frontier = [];
			augmentedInitialState.kind = 'goal';
		} else {
			this.frontier = [options.initialState];
		}
		
		// Discover initial state
		options.onDiscover([augmentedInitialState], null);
	},
	
	getStatistics: function() {
		var stats = [{
	    	name: 'Open list',
		    value: this.frontier.length
		}];
		
		if (this.storeExploredStates) {
			stats.push({
				name: 'Closed list',
				value: this.closedCount
			});
		} else {
			stats.push({
				name: 'Closed list',
				value: 'N/A'
			});
		}
		
		return stats;
	},
	
	iterate: function() {
		
		if (this.goalFound) {
			return true;
		}		
		
		var state = this.frontier.pop();
		var successors = state.generateSuccessors();
		this.closedCount++;
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

			var addToFrontier = false;
				
			if (this.isGoalState(successor) && !this.goalFound) {
				this.goalFound = true;
				augmentedState.kind = 'goal';
			} else if (this.storeExploredStates && this.discovered.hasOwnProperty(successorStr)) {
				augmentedState.kind = 'repeat';
			} else if (this.storeExploredStates) {
				this.discovered[successorStr] = true;
				addToFrontier = true;
			} else {
				addToFrontier = true;
			}
				
			if (addToFrontier) {
				this.frontier.push(successor);
			}
			
			augmentedSuccessors.push(augmentedState);
		}		
		
		// Let application know that states have been discovered
		this.onDiscover(augmentedSuccessors, state);
		
		return this.goalFound;
	},
	
	wasGoalFound: function() {
		return this.goalFound;
	}
	
});