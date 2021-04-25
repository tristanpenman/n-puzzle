ApplicationView = Backbone.View.extend({
  initialize: function (options) {
    const $body = $('body');
    const $window = $(window);
    const $controlPanel = options.$controlPanel;
    const $statsView = options.$statsView;
    const $treeView = options.$treeView;
    const $tutorial = $body.find('#tutorial');

    // Initialise control panel
    new ControlPanel({
      el: options.$controlPanel,
      debug: options.debug,
      model: this.model
    });

    // Initialise tutorial
    new Tutorial({
      el: $tutorial
    });

    // Initialise tree view
    this.treeView = new TreeView({
      el: options.$treeView,
      debug: options.debug,
      model: this.model
    });

    new StatsView({
      el: options.$statsView,
      model: this.model
    });

    const resizeHandler = _.bind(function () {

      // Only show and resize the tree view if the search is running.
      // This improves general rendering performance for elements such
      // as the state editor overlay.

      const newWidth = $('#main').innerWidth() - $controlPanel.outerWidth();
      const $Tutorial = $('.Tutorial');

      if (this.model.getTree().getRootNode() == null) {
        $statsView.toggleClass('invisible', true);
        $treeView.toggleClass('invisible', true);
        $Tutorial.toggleClass('invisible', false);
        this.treeView.setSize(newWidth, 0);
      } else {
        var newHeight = $body.innerHeight();
        $treeView.toggleClass('invisible', false);
        $Tutorial.toggleClass('invisible', true);
        $statsView.toggleClass('invisible', false);
        this.treeView.setSize(newWidth, newHeight);
      }
    }, this);

    this.model.on('change:state', resizeHandler);

    $window
      .load(resizeHandler)
      .resize(resizeHandler);
  }
});
