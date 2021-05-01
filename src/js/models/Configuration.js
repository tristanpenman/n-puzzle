Configuration = Backbone.Model.extend({
  initialize: function () {
    // Set default configuration
    this.set({
      'algorithm': Configuration.getDefaultAlgorithm(),
      'heuristic': Configuration.getDefaultHeuristic(),
      'mode': Configuration.getDefaultControlMode()
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

  isValid: function () {
    return true;
  },

  getAlgorithm: function () {
    return this.get('algorithm');
  },

  getAvailableConfigurations: function () {
    return Configuration;
  },

  getGoalState: function () {
    return this.get('goal');
  },

  getHeuristic: function () {
    return this.get('heuristic');
  },

  getInitialState: function () {
    return this.get('initial');
  },

  getMode: function () {
    return this.get('mode');
  },

  onChange: function () {
    this.trigger('change', this);
  },

  setAlgorithm: function (algorithm) {
    this.set('algorithm', algorithm);
    if (Configuration.getAvailableAlgorithms()[algorithm].usesHeuristic) {
      if (this.get('heuristic') == null) {
        // Set default heuristic
        this.set('heuristic', Configuration.getDefaultHeuristic());
      }
    } else {
      this.set('heuristic', null);
    }
    return this;
  },

  setHeuristic: function (heuristic) {
    var algorithm = this.get('algorithm');
    if (Configuration.getAvailableAlgorithms()[algorithm].usesHeuristic) {
      this.set('heuristic', heuristic);
    } else {
      this.set('heuristic', null);
    }
    return this;
  },

  setMode: function (mode) {
    this.set('mode', mode);
    return this;
  }
});

Configuration.getAvailableAlgorithms = function () {
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
    }
  };
};

Configuration.getAvailableControlModes = function () {
  return {
    'single': {
      name: 'Single-step'
    },
    'burst': {
      name: 'Burst mode'
    }
  };
};

Configuration.getAvailableHeuristics = function () {
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

Configuration.getDefaultAlgorithm = function () {
  return 'bfs';
};

Configuration.getDefaultHeuristic = function () {
  return 'euclidean';
};

Configuration.getDefaultControlMode = function () {
  return 'single';
};
