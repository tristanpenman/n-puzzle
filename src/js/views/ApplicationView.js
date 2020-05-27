ApplicationView = Backbone.View.extend({

    initialize: function(options) {

        // Initialise control panel
        this.controlPanel = new ControlPanel({
            el: options.$controlPanel,
            debug: options.debug,
            model: this.model
        });

        // Initialise tree view
        this.treeView = new TreeView({
            el: options.$treeView,
            debug: options.debug,
            model: this.model
        });

        this.statsView = new StatsView({
            el: options.$statsView,
            model: this.model
        });

        // Cache selectors
        var $body = $('body');
        var $window = $(window);
        var $controlPanel = options.$controlPanel;
        var $statsView = options.$statsView;
        var $treeView = options.$treeView;
        var $main = options.$treeView.find('.main');
        var $tutorial = $body.find('#tutorial');

        resizeHandler = _.bind(function() {

            // Only show and resize the tree view if the search is running.
            // This improves general rendering performance for elements such
            // as the state editor overlay.

            var newWidth = $body.innerWidth() - $controlPanel.outerWidth();

            if (this.model.getTree().getRootNode() == null) {
                $statsView.toggleClass('invisible', true);
                $treeView.toggleClass('invisible', true);
                $tutorial.toggleClass('invisible', false);
                this.treeView.setSize(newWidth, 0);
            } else {
                var newHeight = $body.innerHeight();
                $treeView.toggleClass('invisible', false);
                $tutorial.toggleClass('invisible', true);
                $statsView.toggleClass('invisible', false);
                this.treeView.setSize(newWidth, newHeight);
            }

            var xOffset = $controlPanel.outerWidth();

            $statsView
                .css('position', 'absolute')
                .css('top', '0')
                .css('left', xOffset);

            $treeView
                .css('position', 'absolute')
                .css('top', '0')
                .css('left', xOffset);

            $tutorial
                .css('position', 'absolute')
                .css('top', '0')
                .css('left', xOffset)
                .css('width', newWidth + "px");

        }, this);

        this.model.on('change:state', resizeHandler);

        $window
            .load(resizeHandler)
            .resize(resizeHandler);

        $tutorial.fadeIn();
    }
});