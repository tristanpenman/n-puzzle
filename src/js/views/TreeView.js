
TreeView = Backbone.View.extend({

    initialize: function() {

        this.debug = (this.options.debug == true);

        // Get drawing context
        var $main = this.$el.find('.main');
        var context = $main.get(0).getContext('2d');
        if (!context) {
            return;
        }

        this.reset();

        $main.mousedown(_.bind(function(event){
            this.dragOrigin = {
                'x': event.pageX,
                'y': event.pageY
            };
            event.preventDefault();
        }, this));

        $(document).mousemove(_.bind(function(event){
            if (this.dragOrigin != null) {
                this.dragOffset.x = event.pageX - this.dragOrigin.x;
                this.dragOffset.y = event.pageY - this.dragOrigin.y;
                this.render();
            }
            event.preventDefault();
        }, this));

        $(document).mouseup(_.bind(function(event){
            if (this.dragOrigin != null) {
                this.dragOrigin = null;
                this.finalOffset.x += this.dragOffset.x;
                this.finalOffset.y += this.dragOffset.y;
                this.dragOffset.x = 0;
                this.dragOffset.y = 0;
                event.preventDefault();
            }
        }, this));

        this.renderer = new PuzzleStateRenderer(context);

        // Don't display the tree thumbnail
        this.renderThumbnail = false;

        // Initialise the layout algorithm
        this.layoutAlgorithm = new TreeLayout({
            nodeWidth: this.renderer.getExpectedWidth()
        });

        // Respond to changes within the tree by recalculating the layout of
        // the tree, then rendering the result.
        this.model.getTree().on('change', this.layoutAndRenderTree, this);

        // Respond to the tree being reset by resetting the current position
        // of the tree
        this.model.on('reset:tree', this.reset, this);
    },

    layoutAndRenderTree: function() {
        // Position and draw the tree
        var tree = this.model.getTree();
        if (tree != null) {
            this.layoutAlgorithm.positionTree(tree.getRootNode());
            this.render();
        }
    },

    renderSubtree: function(context, node, coords, xOffset, yOffset, width, height) {

        var nodeAttributes = node.getAttributes();
        var stateColor = '#000';

        switch (node.getAttributes().kind) {
        case 'repeat':
            stateColor = '#F00';
            break;
        case 'goal':
            stateColor = '#0F0';
            break;
        default:
            break;
        }

        // Render this state
        var x = coords.x + xOffset;
        var y = coords.y + yOffset;
        var expectedWidth = this.renderer.getExpectedWidth();
        var expectedHeight = this.renderer.getExpectedHeight();
        if (x + expectedWidth >= 0 && x < width &&
            y + expectedHeight >= 0 && y < height) {
            this.renderer.renderState(node.getState(), stateColor, x, y);
        }

        // Recursively render child states
        var children = node.getChildren();
        for (childIndex in children) {

            // Get nodes for children coordinate
            var childCoords = this.layoutAlgorithm.getCoordinatesForNode(children[childIndex]);
            if (childCoords == null) {
                console.log('Warning: stopped drawing tree due to missing node coordinates');
                return;
            }

            childCoords.x = Math.round(childCoords.x);
            childCoords.y = Math.round(childCoords.y);

            // Draw a line connecting the parent node to its children
            context.beginPath();
            context.moveTo(
                coords.x + xOffset + expectedWidth / 2 + 0.5,
                coords.y + yOffset + expectedHeight + 1);
            context.lineTo(
                childCoords.x + xOffset + expectedWidth / 2 + 0.5,
                childCoords.y + yOffset);
            context.strokeStyle = '#000';
            context.stroke();

            this.renderSubtree(context, children[childIndex], childCoords, xOffset, yOffset, width, height);
        }
    },

    render: function() {

        var $main = this.$el.find('.main');
        if ($main.attr('width') == 0 || $main.attr('height') == 0) {
            return;
        }

        var context = $main.get(0).getContext('2d');
        if (!context) {
            return;
        }

        // Clear canvas
        var width = $main.attr('width');
        var height = $main.attr('height');
        context.clearRect(0, 0, width, height);

        // Center the tree in the viewport
        var boundingBox = this.layoutAlgorithm.getBoundingBox();
        if (boundingBox == null) {
            return;
        }
        var boundingWidth = boundingBox.right - boundingBox.left;
        var xOffset = Math.round((width - boundingWidth) / 2 - boundingBox.left + this.dragOffset.x + this.finalOffset.x);
        var yOffset = Math.round(this.dragOffset.y + this.finalOffset.y);

        // Position and draw the tree
        var tree = this.model.getTree();
        if (tree != null) {
            var rootNode = tree.getRootNode();
            if (rootNode != null) {

                // Get coordinates for root node
                var coords = this.layoutAlgorithm.getCoordinatesForNode(rootNode);
                coords.x = Math.round(coords.x);
                coords.y = Math.round(coords.y);

                this.renderSubtree(context, rootNode, coords, xOffset, yOffset, width, height);
            }
        }

        // Draw debugging rectangle
        if (this.debug) {
            context.strokeStyle = '#CCC';
            context.strokeRect(
                    Math.round(boundingBox.left + xOffset) + 0.5,
                    Math.round(boundingBox.top + yOffset) + 0.5,
                    boundingBox.right - boundingBox.left,
                    boundingBox.bottom - boundingBox.top);
        }
    },

    reset: function() {

        this.dragOrigin = null;

        this.dragOffset = {
            x: 0,
            y: 0
        };

        this.finalOffset = {
            x: 0,
            y: 10
        };
    },

    setSize: function(newWidth, newHeight) {

        // Resize container
        this.$el
            .css('width', newWidth)      // Canvas width
            .css('height', newHeight);    // Canvas height

        // Resize main canvas
        this.$el.find('.main')
            .attr('width', this.$el.innerWidth())
            .attr('height', this.$el.innerHeight());

        // Position or hide the thumbnail canvas
        var $thumbnail = this.$el.find('.thumbnail');
        if (this.renderThumbnail) {
            var top = this.$el.innerHeight() - $thumbnail.attr('height') - 20;
            var left = this.$el.innerWidth() - $thumbnail.attr('width') - 20;
            $thumbnail
                .css('top', top  + 'px')
                .css('left', left + 'px')
                .css('display', 'block');
        } else {
            $thumbnail.css('display', 'none');
        }

        this.render();
    }
});