AlgorithmStats = Backbone.View.extend({
  initialize: function () {
    this.vue = new Vue({
      data: {
        state: this.model.getState(),
        statistics: this.model.getStatistics()
      },
      el: this.el,
      template: `
        <algorithm-stats :state="state" :statistics="statistics"></algorithm-stats>
      `
    });

    this.model.on('change:state', this.handleStateChange, this);
    this.model.on('change:statistics', this.handleStatisticsChange, this);
  },

  handleStateChange: function (model) {
    this.vue.state = model.getState();
  },

  handleStatisticsChange: function (model) {
    this.vue.statistics = model.getStatistics();
  }
});
