Tutorial = Backbone.View.extend({
  initialize: function () {
    this.render();
  },

  render: function () {
    new Vue({
      el: this.el,
      template: `
        <tutorial></tutorial>
      `
    });
  }
});
