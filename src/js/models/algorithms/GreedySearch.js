import InformedSearch from './InformedSearch';

const GreedySearch = InformedSearch.extend({
  initialize: function () {
    this.fScoreFunction = function (state) {
      return state.getHeuristicValue(state);
    };
    this.constructor.__super__.initialize.apply(this, arguments);
  }
});

export default GreedySearch;
