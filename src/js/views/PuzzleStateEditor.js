PuzzleStateEditor = Backbone.View.extend({
  initialize: function () {
    this.render();
  },

  render: function () {
    const model = this.model;
    const vm = new Vue({
      el: this.el,
      data: {
        model: this.model
      },
      methods: {
        discard() {
          vm.$destroy();
          vm.$el.parentNode.removeChild(this.$el);
        },
        save(tiles) {
          model.copyFrom({ tiles });
          vm.$destroy();
          vm.$el.parentNode.removeChild(this.$el);
        }
      },
      template: `
        <puzzle-state-editor
          v-bind:tiles="model.valueOf()"
          @discard="discard"
          @save="save"
        />
      `
    });
  }
});
