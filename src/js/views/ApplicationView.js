ApplicationView = Backbone.View.extend({
  initialize: function (options) {
    const controlPanel = document.getElementById('control_panel');
    const treeView = document.getElementById('tree_view');
    const tutorial = document.getElementById('tutorial');

    // Initialise control panel
    new ControlPanel({
      el: controlPanel,
      model: this.model
    });

    // Initialise tutorial
    new Tutorial({
      el: tutorial
    });

    // Initialise tree view
    new TreeView({
      el: treeView,
      model: this.model
    });

    // Algorithm stats
    const el = document.createElement('div');
    el.classList.add('invisible');
    document.body.appendChild(el);
    new AlgorithmStats({
      el,
      model: this.model
    });

    const toggleClass = (selector, cls, add) => {
      Array.from(selector).forEach((element) => {
        if (add) {
          element.classList.add(cls);
        } else {
          element.classList.remove(cls);
        }
      })
    };

    const resizeHandler = _.bind(function () {
      const TreeView = document.getElementsByClassName('TreeView');
      const Tutorial = document.getElementsByClassName('Tutorial');
      if (this.model.getTree().getRootNode() === null) {
        toggleClass(TreeView, 'invisible', true);
        toggleClass(Tutorial, 'invisible', false);
      } else {
        toggleClass(TreeView, 'invisible', false);
        toggleClass(Tutorial, 'invisible', true);
      }
    }, this);

    resizeHandler();

    this.model.on('change:state', resizeHandler);

    window.onload = resizeHandler;
    window.onresize = resizeHandler;
  }
});
