
SearchTreeNode = function(parent, state, attributes) {

    var children = [];
    var depth = 0;

    // Add this node as a child of its parent
    if (typeof parent !== 'undefined' && parent != null) {
        parent.getChildren().push(this);
        depth = parent.getDepth() + 1;
    };

    this.getAttributes = function() {
        return attributes;
    };

    this.getChild = function(index) {
        return children[index];
    };

    this.getChildCount = function() {
        return children.length;
    };

    this.getChildren = function() {
        return children;
    };

    this.getDepth = function() {
        return depth;
    };

    this.getIndexOfChild = function(child) {
        return children.indexOf(child);
    };

    this.getLeftSibling = function() {
        if (parent != null) {
            var index = parent.getIndexOfChild(this);
            if (index > 0) {
                return parent.getChild(index - 1);
            }
        }
        return null;
    };

    this.getParent = function() {
        return parent;
    };

    this.getRightSibling = function() {
        if (parent != null) {
            var index = parent.getIndexOfChild(this);
            if (index > -1 && index < parent.getChildCount() - 1) {
                return parent.getChild(index + 1);
            }
        }
        return null;
    };

    this.getState = function() {
        return state;
    };

    this.hasLeftSibling = function() {
        if (parent == null) {
            return false;
        }
        var index = parent.getIndexOfChild(this);
        return (index > 0);
    };

    this.hasRightSibling = function() {
        if (parent == null) {
            return false;
        }
        var index = parent.getIndexOfChild(this);
        return (index > -1 && index < parent.getChildCount() - 1);
    };

    this.isLeaf = function() {
        return (children.length == 0);
    };

    this.removeChild = function(child) {
        var idx = this.getIndexOfChild(child);
        if (idx == -1) {
            return false;
        }
        children.splice(idx, 1);
    };
};

/**
 * Model representation of a search tree
 */
SearchTree = Backbone.Model.extend({

    getRootNode: function() {
        return this.rootNode;
    },

    setRootNode: function(rootNode) {
        this.rootNode = rootNode;
        this.trigger('change');
    }
});