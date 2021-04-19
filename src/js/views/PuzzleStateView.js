PuzzleStateView = Backbone.View.extend({
  initialize: function () {
    this.render();
    this.model.on('change', this.render, this);
  },

  render: function () {
    new Vue({
      el: this.el,
      data: {
        model: this.model
      },
      template: `
        <puzzle-state-view v-bind:tiles="model.valueOf()"></puzzle-state-view>
      `
    });
  }
});
