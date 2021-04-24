HelpModal = Backbone.View.extend({
  initialize: function (options) {
    this.html = options.html;
    this.render();
  },

  render: function () {
    const vm = new Vue({
      el: this.el,
      data: {
        html: this.html
      },
      methods: {
        dismiss() {
          vm.$destroy();
          vm.$el.parentNode.removeChild(this.$el);
        }
      },
      template: `
        <help-modal
          v-bind:html="html"
          @dismiss="dismiss"
        />
      `
    });
  }
});
