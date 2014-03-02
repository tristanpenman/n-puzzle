GreedySearch = InformedSearch.extend({

    initialize: function(attributes, options) {
        this.fScoreFunction = function(state) {
            return state.getHeuristicValue(state);
        };
        this.constructor.__super__.initialize.apply(this, arguments);
    }

});