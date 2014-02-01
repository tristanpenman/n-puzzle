/**
 * This function constructs a helper object for the TreeLayout algorithm. The
 * helper object stores the intermediate layout data, and final coordinates,
 * for nodes processed by the TreeLayout algorithm.
 *
 * @param nodeWidth   expected node width, used to maintain bounding box
 * @param nodeHeight  expected node height, used to maintain bounding box
 */
TreeLayoutData = function(nodeWidth, nodeHeight) {

    /**
     * Intermediate layout data associated with nodes in the tree. The attribute
     * objects are accessed via an index based on their position in the
     * nodesVisited array. This data can be discarded after the algorithm
     * has finished laying out the tree.
     */
    var nodeAttributes = {};

    /**
     * Coordinates associated with nodes in the tree. This data is retained
     * after completion of the algorithm.
     */
    var nodeCoordinates = {};

    /**
     * Array of nodes, ordered by when they first had their attributes set.
     * This is used to produce a unique index for each node, that can be used
     * to find node attributes in the nodeAttributes object.
     */
    var nodesVisited = [];

    /** Bounding coordinate on left hand side */
    var xMin = 0;

    /** Bounding coordinate on right hand side */
    var xMax = 0;

    /** Bounding coordinate on top edge */
    var yMin = 0;

    /** Bounding coordinate on bottom edge */
    var yMax = 0;

    /**
     * Get the layout attributes associated with a node, initialising the
     * data structure if necessary.
     *
     * @param node  the node that we want the attributes for
     *
     * @return      an attributes object
     */
    function getOrCreateAttributesForNode(node) {
        var index = nodesVisited.indexOf(node);
        if (index == -1) {
            index = nodesVisited.push(node) - 1;
            return nodeAttributes['node-' + index] = {
                ancestor: null,
                prelim: 0,
                modifier: 0,
                change: 0,
                shift: 0
            };
        }

        return nodeAttributes['node-' + index];
    }

    /**
     * Discards intermediate data (i.e. node attributes)
     */
    this.discardIntermediateData = function() {
        nodeAttributes = {};
    };

    /**
     * Retrieve the ancestor reference for a node.
     *
     * Returns null if not previously set.
     */
    this.getAncestorForNode = function(node) {
        return getOrCreateAttributesForNode(node).ancestor;
    };

    /**
     * Retrieve the entire attributes object for a node.
     */
    this.getAttributesForNode = function(node) {
        var index = nodesVisited.indexOf(node);
        var key = 'node-' + index;
        if (index > 0 && nodeAttributes.hasOwnProperty(key)) {
            return nodeAttributes[key];
        }
        return null;
    };

    /**
     * Get the bounding box for the tree layout.
     *
     * This bounding box is updated whenever setCoordinatesForNode is called.
     *
     * @returns  an object with the attributes 'left', 'right', 'top'
     *           and 'bottom'.
     */
    this.getBoundingBox = function() {
        return {
            'left': xMin,
            'right': xMax,
            'top': yMin,
            'bottom': yMax
        }
    };

    /**
     * Retrieve the change value a for a node.
     *
     * Returns 0 if not previously set.
     */
    this.getChangeForNode = function(node) {
        return getOrCreateAttributesForNode(node).change;
    };

    /**
     * Retrieve the coordinates for a given node in the tree.
     *
     * Returns null if not previously set.
     */
    this.getCoordinatesForNode = function(node) {

        var index = nodesVisited.indexOf(node);
        if (index == -1) {
            return null;
        }

        var key = 'node-' + index;
        if (!nodeCoordinates.hasOwnProperty(key)) {
            return null;
        }

        var coordinates = nodeCoordinates[key];

        // Make a copy of the coordinates object
        return {
            'x': coordinates.x,
            'y': coordinates.y
        };
    };

    /**
     * Retrieve the modifier value for a node.
     *
     * Returns 0 if not previously set.
     */
    this.getModifierForNode = function(node) {
        return getOrCreateAttributesForNode(node).modifier;
    };

    /**
     * Retrieve the position of a node with respect to its siblings.
     *
     * This method will cache the positions of the node's siblings as well,
     * to minimise the number of times the parent's child array needs to be
     * examined.
     */
    this.getNumber = function(node) {
        var parent = node.getParent();
        var attr = getOrCreateAttributesForNode(node);
        if (node.number == null) {
            var i = 1;
            for (var n = 0; n < parent.getChildCount(); n++) {
                var child = parent.getChild(n);
                getOrCreateAttributesForNode(child).number = n;
            }
        }
        return getOrCreateAttributesForNode(node).number;

    };

    /**
     * Retrieve the preliminary X coordinate for a node.
     *
     * Returns 0 if not previously set.
     */
    this.getPrelimForNode = function(node) {
        return getOrCreateAttributesForNode(node).prelim;
    };

    /**
     * Retrieve the shift value for a node.
     *
     * Returns 0 if not previously set.
     */
    this.getShiftForNode = function(node) {
        return getOrCreateAttributesForNode(node).shift;
    };

    /**
     * Retrieve the thread reference for a node.
     *
     * Returns null if not previously set.
     */
    this.getThreadForNode = function(node) {
        return getOrCreateAttributesForNode(node).thread;
    };

    /**
     * Set the ancestor reference associated with a node
     *
     * @param node      node whose ancestor reference is to be updated
     * @param ancestor  new ancestor reference
     */
    this.setAncestorForNode = function(node, ancestor) {
        getOrCreateAttributesForNode(node).ancestor = ancestor;
    };

    /**
     * Set the change value associated with a node
     *
     * @param node    node whose change value is to be updated
     * @param change  new change value
     */
    this.setChangeForNode = function(node, change) {
        getOrCreateAttributesForNode(node).change = change;
    };

    /**
     * Set the final coordinates associated with a node, updating the bounding
     * box for the whole tree if necessary.
     *
     * @param node  node whose coordinates are being set
     * @param x     x coordinate
     * @param y     y coordinate
     */
    this.setCoordinatesForNode = function(node, x, y) {

        // Update horizontal bounding box coordinates
        if (x < xMin) {
            xMin = x;
        } else if (x + nodeWidth > xMax) {
            xMax = x + nodeWidth;
        }

        // Update vertical bounding box coordinates
        if (y < yMin) {
            yMin = y;
        } else if (y + nodeHeight > yMax) {
            yMax = y + nodeHeight;
        }

        var index = nodesVisited.indexOf(node);
        if (index == -1) {
            index = nodesVisited.push(node) - 1;
        }

        var key = 'node-' + index;
        nodeCoordinates[key] = {
            'x': x,
            'y': y
        };
    };

    /**
     * Set the modifier value associated with a node.
     *
     * @param node      node whose modifier is to be set
     * @param modifier  new modifier value
     */
    this.setModifierForNode = function(node, modifier) {
        getOrCreateAttributesForNode(node).modifier = modifier;
    };

    /**
     * Set the preliminary X-coordinate associated with a node.
     *
     * @param node      node whose preliminary x coordinate is to be set
     * @param prelim  new preliminary x coordinate value
     */
    this.setPrelimForNode = function(node, prelim) {
        getOrCreateAttributesForNode(node).prelim = prelim;
    };

    /**
     * Set the shift value associated with a node.
     *
     * @param node      node whose shift value is to be set
     * @param shift  new shift value
     */
    this.setShiftForNode = function(node, shift) {
        getOrCreateAttributesForNode(node).shift = shift;
    };

    /**
     * Set the thread reference associated with a node.
     *
     * @param node      node whose thread reference is to be set
     * @param thread  new thread reference
     */
    this.setThreadForNode = function(node, thread) {
        getOrCreateAttributesForNode(node).thread = thread;
    };

};

TreeLayout = function(userOptions) {

    // Merge the user's options into the default options object
    var options = $.extend({

        /** The fixed the distance between adjacent levels of the tree */
        levelSeparation: 40,

        /** The minimum distance between adjacent siblings of the tree */
        siblingSeparation: 10,

        /** The minimum distance between adjacent subtrees of a tree */
        subtreeSeparation: 25,

        /** Width of a node, in pixels */
        nodeWidth: 50,

        /** Height of a node, in pixels */
        nodeHeight: 50

    }, userOptions);

    /**
     * Container for the intermediate attributes and final coordinates produced
     * by the tree layout algorithm.
     */
    var data = null;

    /**
     * Finds the greatest distinct ancestor of a node [node] and its right
     * neighbour [rightNeighbour].
     */
    var ancestor = function(node, rightNeighbour, defaultAncestor) {
        var ancestor = data.getAncestorForNode(node);
        var parent = rightNeighbour.getParent();
        return parent.getIndexOfChild(ancestor) > -1 ? ancestor : defaultAncestor;
    };

    /**
     * TODO: Method description
     */
    var executeShifts = function(node) {

        var shift = 0;
        var change = 0;
        var childCount = node.getChildCount();

        for (var i = 0; i < childCount; i++) {

            // Work from right to left
            var child = node.getChild(childCount - i - 1);

            change += data.getChangeForNode(child);

            // Update prelim and modifier for child node
            var prelim = data.getPrelimForNode(child) + shift;
            var modifier = data.getModifierForNode(child) + shift;
            data.setPrelimForNode(child, prelim);
            data.setModifierForNode(child, modifier);

            shift += data.getShiftForNode(child) + change;
        }

    };

    /**
     * Calculate the horizontal distance between the midpoints of two nodes.
     *
     * If the nodes have the same parent, then the sibling separation distance
     * will be used. Otherwise, the subtree separation distance will be used.
     * Both of these values can be configured in the userOptions object that
     * is provided to the algorithm during construction.
     *
     * @param a  first node
     * @param b  second node
     */
    var calculateDistance = function(a, b) {
        if (a.getParent() == b.getParent()) {
            return options.nodeWidth + options.siblingSeparation;
        } else {
            return options.nodeWidth + options.subtreeSeparation;
        }
    };


    /**
     * TODO: Method description
     */
    var moveSubtree = function(wMinus, wPlus, parent, shift) {

        var subtrees = data.getNumber(wPlus, parent)
            - data.getNumber(wMinus, parent);

        data.setChangeForNode(wPlus, data.getChangeForNode(wPlus) - shift / subtrees);
        data.setShiftForNode(wPlus, data.getShiftForNode(wPlus) + shift);
        data.setChangeForNode(wMinus, data.getChangeForNode(wMinus) + shift / subtrees);
        data.setPrelimForNode(wPlus, data.getPrelimForNode(wPlus) + shift);
        data.setModifierForNode(wPlus, data.getModifierForNode(wPlus) + shift);

    };

    /**
     * TODO: Method description
     */
    var nextLeft = function(v) {
        return v.isLeaf() ? data.getThreadForNode(v) : v.getChild(0);
    };

    /**
     * TODO: Method description
     */
    var nextRight = function(v) {
        return v.isLeaf() ? data.getThreadForNode(v) : v.getChild(v.getChildCount() - 1);
    };

    /**
     * TODO: Method description
     */
    var apportion = function(node, defaultAncestor, leftSibling, parentOfNode) {

        if (leftSibling == null) {
            return defaultAncestor;
        }

        var vOPlus = node;
        var vIPlus = node;
        var vIMinus = leftSibling;
        var vOMinus = parentOfNode.getChild(0);

        var sIPlus = data.getModifierForNode(vIPlus);
        var sOPlus = data.getModifierForNode(vOPlus);
        var sIMinus = data.getModifierForNode(vIMinus);
        var sOMinus = data.getModifierForNode(vOMinus);

        var nextRightVIMinus = nextRight(vIMinus);
        var nextLeftVIPlus = nextLeft(vIPlus);

        while (nextRightVIMinus != null && nextLeftVIPlus != null) {

            vIMinus = nextRightVIMinus;
            vIPlus = nextLeftVIPlus;
            vOMinus = nextLeft(vOMinus);
            vOPlus = nextRight(vOPlus);
            data.setAncestorForNode(vOPlus, node);
            var shift = (data.getPrelimForNode(vIMinus) + sIMinus)
                         - (data.getPrelimForNode(vIPlus) + sIPlus)
                         + (calculateDistance(vIMinus, vIPlus));
            if (shift > 0) {
                moveSubtree(ancestor(vIMinus, node, defaultAncestor),
                        node, parentOfNode, shift);
                sIPlus += shift;
                sOPlus += shift;
            }

            sIMinus += data.getModifierForNode(vIMinus);
            sIPlus += data.getModifierForNode(vIPlus);
            sOMinus += data.getModifierForNode(vOMinus);
            sOPlus += data.getModifierForNode(vOPlus);

            nextRightVIMinus = nextRight(vIMinus);
            nextLeftVIPlus = nextLeft(vIPlus);

        }

        if (nextRightVIMinus != null && nextRight(vOPlus) == null) {
            data.setThreadForNode(vOPlus, nextRightVIMinus);
            data.setModifierForNode(vOPlus, data.getModifierForNode(vOPlus) + sIMinus - sOPlus);
        }

        if (nextLeftVIPlus != null && nextLeft(vOMinus) == null) {
            data.setThreadForNode(vOMinus, nextLeftVIPlus);
            data.setModifierForNode(vOMinus, data.getModifierForNode(vOMinus) + sIPlus - sOMinus);
            defaultAncestor = node;
        }

        return defaultAncestor;

    };

    /**
     *
     */
    var firstWalk = function(node, leftSibling) {

        if (node.isLeaf()) {

            if (leftSibling != null) {
                data.setPrelimForNode(node,
                        data.getPrelimForNode(leftSibling) + calculateDistance(node, leftSibling));
            } else {
                data.setPrelimForNode(node, 0);
            }

        } else {

            var firstChild = node.getChild(0);
            var lastChild = node.getChild(node.getChildCount() - 1);
            var defaultAncestor = firstChild;
            var previousChild = null;
            for (var i = 0; i < node.getChildCount(); i++) {
                var child = node.getChild(i);
                firstWalk(child, previousChild);
                defaultAncestor = apportion(child, defaultAncestor, previousChild, node);
                previousChild = child;
            }

            executeShifts(node);

            var midPoint =
                (data.getPrelimForNode(firstChild) +
                        data.getPrelimForNode(lastChild)) / 2;

            if (leftSibling != null) {
                var prelim =
                    data.getPrelimForNode(leftSibling) +
                    calculateDistance(node, leftSibling);
                data.setPrelimForNode(node, prelim);
                data.setModifierForNode(node, prelim - midPoint);
            } else {
                data.setPrelimForNode(node, midPoint);
            }
        }

    };

    /**
     * TODO: Method description
     */
    var secondWalk = function(v, m, level, levelStart) {

        var x = data.getPrelimForNode(v) + m;
        var y = levelStart + level * (options.nodeHeight + options.levelSeparation);

        data.setCoordinatesForNode(v, x, y);

        if (!v.isLeaf()) {
            for (var i = 0; i < v.getChildCount(); i++) {
                var child = v.getChild(i);
                secondWalk(child, m + data.getModifierForNode(v), level + 1, levelStart);
            }
        }
    };

    this.getBoundingBox = function(node) {
        if (data != null) {
            return data.getBoundingBox(node);
        }
        return null;
    };

    /**
     * Retrieve the coordinates for a given node in the tree.
     */
    this.getCoordinatesForNode = function(node) {
        if (data != null) {
            return data.getCoordinatesForNode(node);
        }
        return null;
    };

    /**
     * Retrieve the intermediate layout data for a given node in the tree.
     */
    this.getIntermediateDataForNode = function(node) {
        if (data != null) {
            return data.getAttributesForNode(node);
        }
        return null;
    };

    /**
     * Layout the nodes in a tree, starting at rootNode.
     */
    this.positionTree = function(rootNode, userOptions) {

        var fnOptions = $.extend({
            stopAfterFirstWalk: false
        }, userOptions);

        data = new TreeLayoutData(options.nodeWidth, options.nodeHeight);

        // Reset bounding box coordinates
        xMin = xMax = yMin = yMax = 0;

        if (rootNode != null) {

            firstWalk(rootNode, null);

            if (fnOptions.stopAfterFirstWalk) {
                // Allow the algorithm to stop here for testing purposes.
                return;
            }

            secondWalk(rootNode, 0 - data.getPrelimForNode(rootNode), 0, 0);
        }

        // Minimise memory usage by discarding intermediate layout data
        data.discardIntermediateData();

    };
}