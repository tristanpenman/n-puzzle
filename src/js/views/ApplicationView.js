ApplicationView = Backbone.View.extend({
  initialize: function (options) {
    const $body = $('body');
    const $window = $(window);
    const $controlPanel = options.$controlPanel;
    const treeView = document.getElementById('tree_view');
    const tutorial = document.getElementById('tutorial');

    // Initialise control panel
    new ControlPanel({
      el: options.$controlPanel,
      debug: options.debug,
      model: this.model
    });

    // Initialise tutorial
    new Tutorial({
      el: tutorial
    });

    // Initialise tree view
    this.treeView = new TreeView({
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

    const resizeHandler = _.bind(function () {
      const $TreeView = $('.TreeView');
      const $Tutorial = $('.Tutorial');
      if (this.model.getTree().getRootNode() === null) {
        $TreeView.toggleClass('invisible', true);
        $Tutorial.toggleClass('invisible', false);
      } else {
        $TreeView.toggleClass('invisible', false);
        $Tutorial.toggleClass('invisible', true);
      }
    }, this);

    resizeHandler();

    this.model.on('change:state', resizeHandler);

    $window
      .load(resizeHandler)
      .resize(resizeHandler);
  }
});
