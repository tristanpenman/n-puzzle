// Define a representation of the application configuration
Configuration = Backbone.Model.extend({
	
	initialize: function() {
		
		if (!this.has('availableConfigurations')) {
			throw "An available configurations object has not been provided to the Configuration model.";
		}

		var availableConfigurations = this.get('availableConfigurations');
		
		this.set({
			'algorithm': availableConfigurations.getDefaultAlgorithm(),
			'heuristic': availableConfigurations.getDefaultHeuristic(),
			'mode': availableConfigurations.getDefaultControlMode()
		});
		
		if (!this.has('goal')) {
			this.set('goal', new PuzzleState());
		}
		
		if (!this.has('initial')) {
			this.set('initial', new PuzzleState());
		}
		
		// Respond to any changes made to the nested models
		this.get('initial').on('change', this.onChange, this);
		this.get('goal').on('change', this.onChange, this);
	},
	
	isValid: function() {
		return true;
	},

	getAlgorithm: function() {
		return this.get('algorithm');
	},

	getAvailableConfigurations: function() {
		return this.get('availableConfigurations');
	},
	
	getGoalState: function() {
		return this.get('goal');
	},
	
	getHeuristic: function() {
		return this.get('heuristic');
	},

	getInitialState: function() {
		return this.get('initial');
	},
	
	getMode: function() {
		return this.get('mode');
	},
	
	onChange: function() {
		this.trigger('change');
	},
	
	setAlgorithm: function(algorithm) {
		this.set('algorithm', algorithm);
		var availableConfigs = this.getAvailableConfigurations();
		if (availableConfigs.getAvailableAlgorithms()[algorithm].usesHeuristic) {
			if (this.get('heuristic') == null) {
				// Set default heuristic
				this.set('heuristic', availableConfigs.getDefaultHeuristic());
			}
		} else {
			this.set('heuristic', null);
		}
		return this;
	},
	
	setHeuristic: function(heuristic) {
		var availableConfigs = this.getAvailableConfigurations();
		var algorithm = this.get('algorithm');
		if (availableConfigs.getAvailableAlgorithms()[algorithm].usesHeuristic) {
			this.set('heuristic', heuristic);
		} else {
			this.set('heuristic', null);
		}
		return this;
	},
	
	setMode: function(mode) {
		this.set('mode', mode);
		return this;
	}
	
});

Configuration.getAvailableAlgorithms = function() {
	return {
		'bfs': {
			name: 'Breadth-first search',
			usesHeuristic: false,
			className: 'BreadthFirstSearch'
		},
		'dfs': {
			name: 'Depth-first search',
			usesHeuristic: false,
			className: 'DepthFirstSearch'
		},
		'ids': {
			name: 'Iterative deepening search',
			usesHeuristic: false,
			className: 'IterativeDeepeningSearch'
		},
		'greedy': {
			name: 'Greedy search',
			usesHeuristic: true,
			className: 'GreedySearch'
		},
		'astar': {
			name: 'A* search',
			usesHeuristic: true,
			className: 'AStarSearch'
		}/*,
		'branch': {
			name: 'Branch-and-bound search',
			usesHeuristic: true,
			className: 'BranchAndBoundSearch'
		}*/
	};
};

Configuration.getAvailableControlModes = function() {
	return {
		'single': {
			name: 'Single-step'
		},
		/*'prediction': {
			name: 'User prediction'
		},*/
		'burst': {
			name: 'Burst mode'
		}
	};
};

Configuration.getAvailableHeuristics = function() {
	return {
		'euclidean': {
			name: 'Euclidean distance',
			fnName: 'calculateEuclideanDistance'
		},
		'manhattan': {
			name: 'Manhattan distance',
			fnName: 'calculateManhattanDistance'
		},
		'tiles': {
			name: 'Tiles out-of-place',
			fnName: 'calculateTilesOutOfPlace'
		}
	};
};

Configuration.getDefaultAlgorithm = function() {
	return 'bfs';
};

Configuration.getDefaultHeuristic = function() {
	return 'euclidean';
};

Configuration.getDefaultControlMode = function() {
	return 'single';
};