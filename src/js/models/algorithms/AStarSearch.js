import InformedSearch from './InformedSearch';

const AStarSearch = InformedSearch.extend({
  initialize: function (attributes, options) {
    this.fScoreFunction = function (state) {
      return state.getDepth() + state.getHeuristicValue();
    };
    this.constructor.__super__.initialize.apply(this, arguments);
  }
});

export default AStarSearch;
