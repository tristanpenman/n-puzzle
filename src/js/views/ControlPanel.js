ControlPanel = Backbone.View.extend({
  initialize: function () {
    this.render();

    this.model.on('change', this.handleStateChange, this);
    this.model.getConfiguration().on('change', this.handleConfigurationChange, this);
  },

  handleConfigurationChange: function (val) {
    this.vue.configuration = val;
  },

  handleStateChange: function (val) {
    this.vue.state = val.getState();
  },

  render: function () {
    const model = this.model;
    this.vue = new Vue({
      data: {
        configuration: model.getConfiguration(),
        state: model.getState()
      },
      el: this.el,
      methods: {
        back: () => model.undo(),
        next: () => model.next(),
        pause: () => model.pause(),
        reset: () => model.reset(),
        resume: () => model.resume(),
        start: () => model.start()
      },
      template: `
        <control-panel
          v-bind:configuration="configuration"
          v-bind:state="state"
          @back="back"
          @next="next"
          @pause="pause"
          @reset="reset"
          @resume="resume"
          @start="start"
        />
      `
    });
  }
});
