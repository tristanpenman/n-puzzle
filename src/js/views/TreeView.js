
TreeView = Backbone.View.extend({

    /**
     * Function to determine the width of scroll bars.
     */
    getScrollbarWidth: function() {
        var outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    },

    initialize: function(options) {
        // Layout constants
        this.scrollbarWidth = this.getScrollbarWidth();
        this.treeLayoutMarginLeft = 120;
        this.treeLayoutMarginRight = 120;
        this.treeLayoutMarginTop = 10;
        this.treeLayoutMarginBottom = 20;

        // Enable debug mode
        this.debug = (options.debug == true);

        // Get drawing context
        var $main = this.$el.find('.main');
        var context = $main.get(0).getContext('2d');
        if (!context) {
            return;
        }

        $main.mousedown(_.bind(function(event){
            // TODO: implement node selection
            event.preventDefault();
        }, this));

        $(document).mousemove(_.bind(function(event){
            // TODO: implement node selection
            event.preventDefault();
        }, this));

        $(document).mouseup(_.bind(function(event){
            // TODO: implement node selection
            event.preventDefault();
        }, this));

        this.renderer = new PuzzleStateRenderer(context);

        // Don't display the tree thumbnail
        this.renderThumbnail = false;

        // Initialise the layout algorithm
        this.layoutAlgorithm = new TreeLayout({
            nodeWidth: this.renderer.getExpectedWidth(),
            nodeHeight: this.renderer.getExpectedHeight()
        });

        // Respond to changes within the tree by recalculating the layout of
        // the tree, then rendering the result.
        this.model.getTree().on('change', this.layoutAndRenderTree, this);

        // When the user scrolls using the virtual viewport, the offset of the
        // the search tree should be updated using the scrollbar positions.
        this.$viewport = this.$el.find('#viewport');
        this.$viewport.scroll(_.bind(this.render, this));

        // Respond to the tree being reset by resetting the virtual viewport
        this.model.on('reset:tree', function() {
            this.$viewport
                .css('width', '0px')
                .css('height', '0px');
            },
            this
        );
    },

    layoutAndRenderTree: function() {

        // Position and draw the tree
        var tree = this.model.getTree();
        if (tree != null) {

            // Calculate new layout for tree
            this.layoutAlgorithm.positionTree(tree.getRootNode());

            // Render new tree layout if the canvas is visible
            var $main = this.$el.find('.main');
            var width = $main.attr('width');
            var height = $main.attr('height');
            if (width > 0 && height > 0) {
                this.render();
            }
        }
    },

    renderSubtree: function(context, node, coords, xOffset, yOffset, width, height) {

        var nodeAttributes = node.getAttributes();
        var stateColor = '#000';

        switch (node.getAttributes().kind) {
        case 'normal':
            stateColor = '#00F';     // Blue
            break;
        case 'goal_path':
            stateColor = '#fdbe00';  // Gold
            break;
        case 'next':
            stateColor = '#F00';     // Red
            break;
        case 'explored':
        case 'repeat':
            stateColor = '#999';     // Grey
            break;
        case 'goal':
            stateColor = '#0F0';     // Green
            break;
        case 'culled':
            stateColor = '#F0F';
            break;
        default:
            break;
        }

        // Render this state
        var x = Math.round(coords.x + xOffset);
        var y = Math.round(coords.y + yOffset);
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

            // Draw a line connecting the parent node to its children
            context.beginPath();
            context.moveTo(
                Math.round(coords.x + xOffset + expectedWidth / 2) + 0.5,
                coords.y + yOffset + expectedHeight + 1);
            context.lineTo(
                Math.round(childCoords.x + xOffset + expectedWidth / 2) + 0.5,
                childCoords.y + yOffset);
            context.strokeStyle = '#000';
            context.stroke();

            this.renderSubtree(context, children[childIndex], childCoords, xOffset, yOffset, width, height);
        }
    },

    render: function() {

        var $main = this.$el.find('.main');
        var width = $main.attr('width');
        var height = $main.attr('height');
        if (width == 0 || height == 0) {
            return;
        }

        var context = $main.get(0).getContext('2d');
        if (!context) {
            return;
        }

        // Clear canvas
        context.clearRect(0, 0, width, height);

        // Center the tree in the viewport
        var boundingBox = this.layoutAlgorithm.getBoundingBox();
        if (boundingBox == null) {
            return;
        }

        var boundingWidth = boundingBox.right - boundingBox.left;
        var boundingHeight = boundingBox.bottom - boundingBox.top;

        var xOffset = Math.max(
            (width - boundingWidth) / 2 - boundingBox.left,
            this.treeLayoutMarginLeft - boundingBox.left
        ) - this.$viewport.scrollLeft();

        var yOffset = this.treeLayoutMarginTop - boundingBox.top - this.$viewport.scrollTop();

        virtualDoc = {
            x: this.treeLayoutMarginLeft,
            y: this.treeLayoutMarginTop,
            width: Math.max(width - (this.treeLayoutMarginLeft + this.treeLayoutMarginRight), boundingWidth),
            height: Math.max(height - (this.treeLayoutMarginTop + this.treeLayoutMarginBottom), boundingHeight)
        };

        if (this.debug) {
            context.strokeStyle = '#CCC';
            context.strokeRect(
                    Math.round(virtualDoc.x) + 0.5 - this.$viewport.scrollLeft(),
                    Math.round(virtualDoc.y) + 0.5 - this.$viewport.scrollTop(),
                    virtualDoc.width,
                    virtualDoc.height);
        }

        this.$el.find('#fakescrolldiv')
            .css('width', (virtualDoc.width + this.treeLayoutMarginLeft + this.treeLayoutMarginRight) + "px")
            .css('height', (virtualDoc.height + this.treeLayoutMarginTop + this.treeLayoutMarginBottom) + "px");


        // Position and draw the tree
        var tree = this.model.getTree();
        if (tree != null) {
            var rootNode = tree.getRootNode();
            if (rootNode != null) {

                // Get coordinates for root node
                var coords = this.layoutAlgorithm.getCoordinatesForNode(rootNode);
                coords.x = 0;
                coords.y = 0;

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

    setSize: function(newWidth, newHeight) {

        // Resize container
        this.$el
            .css('width', newWidth)       // Canvas width
            .css('height', newHeight);    // Canvas height

        // Resize main canvas
        this.$el.find('.main')
            .attr('width', this.$el.innerWidth() - this.scrollbarWidth)
            .attr('height', this.$el.innerHeight() - this.scrollbarWidth);

        this.$el.find('#viewport')
            .css('overflow', 'scroll')
            .css('position', 'absolute')
            .css('width', newWidth)
            .css('height', newHeight);

        this.render();
    }
});