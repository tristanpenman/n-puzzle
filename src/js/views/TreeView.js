TreeView = Backbone.View.extend({
  initialize: function () {
    this.render();

    this.model.getTree().on('change', this.handleTreeChange, this);
  },

  handleTreeChange: function () {
    this.vue.model = {
      cycle: this.vue.model.cycle + 1,
      tree: this.model.getTree()
    };
  },

  render: function () {
    this.vue = new Vue({
      data: {
        model: {
          cycle: 1,
          tree: this.model.getTree()
        }
      },
      el: this.el,
      template: `
        <tree-view v-bind:model="model"></tree-view>
      `
    });
  }
});
