GreedySearch = InformedSearch.extend({
	
	initialize: function(attributes, options) {
		this.heuristicFunction = function(state) {
			return options.heuristicFunction(state);
		};
		this.constructor.__super__.initialize.apply(this, arguments);
	}

});