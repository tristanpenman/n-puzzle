IterativeDeepeningSearch = Backbone.Model.extend({
	
	initialize: function(attributes, options) {
		
		// Callback functions
		this.isGoalState = options.isGoalState;
		this.onDiscover = options.onDiscover;
		
		// Discovered nodes in the current iteration
		this.discovered = {};
		this.discovered[options.initialState.toString()] = 0;
		
		// Number of explored nodes
		this.closedCount = 0;
		
		// Prepare initial state for discovery, and for future iterations
		this.augmentedInitialState = {
			originalState: options.initialState,
			depth: 0,
			kind: 'normal'
		};
		
		// Check whether or not initial state is a goal
		this.goalFound = this.isGoalState(options.initialState);
		if (this.goalFound) {
			this.augmentedInitialState.kind = 'goal';
			this.frontier = [];
		} else {
			this.frontier = [this.augmentedInitialState];
		}
		
		// Initial maximum depth is zero
		this.set('maxDepth', 0);
		
		// Discover initial state
		options.onDiscover([this.augmentedInitialState], null);
	},
	
	getMaxDepth: function() {
		return this.get('maxDepth');
	},
	
	getStatistics: function() {
		return [
			{
				name: 'Maximum depth',
				value: this.getMaxDepth()
			},
			{
				name: 'Open list',
				value: this.frontier.length
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
		
		var maxDepth = this.getMaxDepth();
		var numStates = 0;
			
		// As long as there are states in the frontier, and no states have 
		// been added to the tree, the search should continue.
		while (this.frontier.length > 0 && numStates == 0) {
			
			var augmentedState = this.frontier.pop();
			if (augmentedState.depth < maxDepth) {
			
				var parentState = augmentedState.originalState
				var successors = parentState.generateSuccessors();
				this.closedCount++;
				var childDepth = augmentedState.depth + 1;
				
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

					var isRepeat = this.discovered.hasOwnProperty(successorStr);
					
					if (this.isGoalState(successor) && !this.goalFound) {
						this.goalFound = true;
						childAugmentedState.kind = 'goal';
					} else if (isRepeat) {
						childAugmentedState.kind = 'repeat';
					} else {
						childAugmentedState.kind = 'normal';
						this.discovered[successorStr] = true;
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
			this.discovered = {};
			this.discovered[this.augmentedInitialState.originalState] = true;
			this.closedCount = 0;
			this.onDiscover([this.augmentedInitialState], null);
		}
		
		return this.goalFound;
	},
	
	wasGoalFound: function() {
		return this.goalFound;
	}
		
});