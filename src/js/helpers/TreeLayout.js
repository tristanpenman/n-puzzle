import Util from './Util';

/**
 * This class provides a helper object for the TreeLayout algorithm. The
 * helper object stores the intermediate layout data, and final coordinates,
 */
class TreeLayoutData {
  /**
   * Construct a helper object for the TreeLayout algorithm.
   *
   * @param nodeWidth   expected node width, used to maintain bounding box
   * @param nodeHeight  expected node height, used to maintain bounding box
   */
  constructor(nodeWidth, nodeHeight) {
    /**
     * Intermediate layout data associated with nodes in the tree. The attribute
     * objects are accessed via an index based on their position in the
     * nodesVisited array. This data can be discarded after the algorithm
     * has finished laying out the tree.
     */
    let nodeAttributes = {};

    /**
     * Coordinates associated with nodes in the tree. This data is retained
     * after completion of the algorithm.
     */
    const nodeCoordinates = {};

    /**
     * Array of nodes, ordered by when they first had their attributes set.
     * This is used to produce a unique index for each node, that can be used
     * to find node attributes in the nodeAttributes object.
     */
    const nodesVisited = [];

    /** Bounding coordinate on left hand side */
    let xMin = 0;

    /** Bounding coordinate on right hand side */
    let xMax = 0;

    /** Bounding coordinate on top edge */
    let yMin = 0;

    /** Bounding coordinate on bottom edge */
    let yMax = 0;

    /**
     * Get the layout attributes associated with a node, initialising the
     * data structure if necessary.
     *
     * @param node  the node that we want the attributes for
     *
     * @return      an attributes object
     */
    function getOrCreateAttributesForNode(node) {
      let index = nodesVisited.indexOf(node);
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
    this.discardIntermediateData = function () {
      nodeAttributes = {};
    };

    /**
     * Retrieve the ancestor reference for a node.
     *
     * Returns null if not previously set.
     */
    this.getAncestorForNode = function (node) {
      return getOrCreateAttributesForNode(node).ancestor;
    };

    /**
     * Retrieve the entire attributes object for a node.
     */
    this.getAttributesForNode = function (node) {
      const index = nodesVisited.indexOf(node);
      const key = 'node-' + index;
      if (index > 0 && Object.prototype.hasOwnProperty.call(nodeAttributes, key)) {
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
    this.getBoundingBox = function () {
      return {
        'left': xMin,
        'right': xMax,
        'top': yMin,
        'bottom': yMax
      };
    };

    /**
     * Retrieve the change value a for a node.
     *
     * Returns 0 if not previously set.
     */
    this.getChangeForNode = function (node) {
      return getOrCreateAttributesForNode(node).change;
    };

    /**
     * Retrieve the coordinates for a given node in the tree.
     *
     * Returns null if not previously set.
     */
    this.getCoordinatesForNode = function (node) {

      const index = nodesVisited.indexOf(node);
      if (index == -1) {
        return null;
      }

      const key = 'node-' + index;
      if (!Object.prototype.hasOwnProperty.call(nodeCoordinates, key)) {
        return null;
      }

      const coordinates = nodeCoordinates[key];

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
    this.getModifierForNode = function (node) {
      return getOrCreateAttributesForNode(node).modifier;
    };

    /**
     * Retrieve the position of a node with respect to its siblings.
     *
     * This method will cache the positions of the node's siblings as well,
     * to minimise the number of times the parent's child array needs to be
     * examined.
     */
    this.getNumber = function (node) {
      const parent = node.getParent();
      if (node.number == null) {
        for (let n = 0; n < parent.getChildCount(); n++) {
          const child = parent.getChild(n);
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
    this.getPrelimForNode = function (node) {
      return getOrCreateAttributesForNode(node).prelim;
    };

    /**
     * Retrieve the shift value for a node.
     *
     * Returns 0 if not previously set.
     */
    this.getShiftForNode = function (node) {
      return getOrCreateAttributesForNode(node).shift;
    };

    /**
     * Retrieve the thread reference for a node.
     *
     * Returns null if not previously set.
     */
    this.getThreadForNode = function (node) {
      return getOrCreateAttributesForNode(node).thread;
    };

    /**
     * Set the ancestor reference associated with a node
     *
     * @param node      node whose ancestor reference is to be updated
     * @param ancestor  new ancestor reference
     */
    this.setAncestorForNode = function (node, ancestor) {
      getOrCreateAttributesForNode(node).ancestor = ancestor;
    };

    /**
     * Set the change value associated with a node
     *
     * @param node    node whose change value is to be updated
     * @param change  new change value
     */
    this.setChangeForNode = function (node, change) {
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
    this.setCoordinatesForNode = function (node, x, y) {

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

      let index = nodesVisited.indexOf(node);
      if (index == -1) {
        index = nodesVisited.push(node) - 1;
      }

      const key = 'node-' + index;
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
    this.setModifierForNode = function (node, modifier) {
      getOrCreateAttributesForNode(node).modifier = modifier;
    };

    /**
     * Set the preliminary X-coordinate associated with a node.
     *
     * @param node      node whose preliminary x coordinate is to be set
     * @param prelim  new preliminary x coordinate value
     */
    this.setPrelimForNode = function (node, prelim) {
      getOrCreateAttributesForNode(node).prelim = prelim;
    };

    /**
     * Set the shift value associated with a node.
     *
     * @param node      node whose shift value is to be set
     * @param shift  new shift value
     */
    this.setShiftForNode = function (node, shift) {
      getOrCreateAttributesForNode(node).shift = shift;
    };

    /**
     * Set the thread reference associated with a node.
     *
     * @param node      node whose thread reference is to be set
     * @param thread  new thread reference
     */
    this.setThreadForNode = function (node, thread) {
      getOrCreateAttributesForNode(node).thread = thread;
    };
  }
}

class TreeLayout {
  constructor(userOptions) {
    // Merge the user's options into the default options object
    const options = Util.extend({
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
    let data = null;

    /**
     * Finds the greatest distinct ancestor of a node [node] and its right
     * neighbour [rightNeighbour].
     */
    const ancestor = function (node, rightNeighbour, defaultAncestor) {
      const ancestor = data.getAncestorForNode(node);
      const parent = rightNeighbour.getParent();
      return parent.getIndexOfChild(ancestor) > -1 ? ancestor : defaultAncestor;
    };

    /**
     * TODO: Method description
     */
    const executeShifts = function (node) {
      let shift = 0;
      let change = 0;
      const childCount = node.getChildCount();

      for (let i = 0; i < childCount; i++) {
        // Work from right to left
        const child = node.getChild(childCount - i - 1);

        change += data.getChangeForNode(child);

        // Update prelim and modifier for child node
        const prelim = data.getPrelimForNode(child) + shift;
        const modifier = data.getModifierForNode(child) + shift;
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
    const calculateDistance = function (a, b) {
      if (a.getParent() == b.getParent()) {
        return options.nodeWidth + options.siblingSeparation;
      } else {
        return options.nodeWidth + options.subtreeSeparation;
      }
    };


    /**
     * TODO: Method description
     */
    const moveSubtree = function (wMinus, wPlus, parent, shift) {

      const subtrees = data.getNumber(wPlus, parent) - data.getNumber(wMinus, parent);

      data.setChangeForNode(wPlus, data.getChangeForNode(wPlus) - shift / subtrees);
      data.setShiftForNode(wPlus, data.getShiftForNode(wPlus) + shift);
      data.setChangeForNode(wMinus, data.getChangeForNode(wMinus) + shift / subtrees);
      data.setPrelimForNode(wPlus, data.getPrelimForNode(wPlus) + shift);
      data.setModifierForNode(wPlus, data.getModifierForNode(wPlus) + shift);
    };

    /**
     * TODO: Method description
     */
    const nextLeft = function (v) {
      return v.isLeaf() ? data.getThreadForNode(v) : v.getChild(0);
    };

    /**
     * TODO: Method description
     */
    const nextRight = function (v) {
      return v.isLeaf() ? data.getThreadForNode(v) : v.getChild(v.getChildCount() - 1);
    };

    /**
     * TODO: Method description
     */
    const apportion = function (node, defaultAncestor, leftSibling, parentOfNode) {

      if (leftSibling == null) {
        return defaultAncestor;
      }

      let vOPlus = node;
      let vIPlus = node;
      let vIMinus = leftSibling;
      let vOMinus = parentOfNode.getChild(0);

      let sIPlus = data.getModifierForNode(vIPlus);
      let sOPlus = data.getModifierForNode(vOPlus);
      let sIMinus = data.getModifierForNode(vIMinus);
      let sOMinus = data.getModifierForNode(vOMinus);

      let nextRightVIMinus = nextRight(vIMinus);
      let nextLeftVIPlus = nextLeft(vIPlus);

      while (nextRightVIMinus != null && nextLeftVIPlus != null) {
        vIMinus = nextRightVIMinus;
        vIPlus = nextLeftVIPlus;
        vOMinus = nextLeft(vOMinus);
        vOPlus = nextRight(vOPlus);
        data.setAncestorForNode(vOPlus, node);
        const shift = (data.getPrelimForNode(vIMinus) + sIMinus)
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
    const firstWalk = function (node, leftSibling) {
      if (node.isLeaf()) {
        if (leftSibling != null) {
          data.setPrelimForNode(node,
            data.getPrelimForNode(leftSibling) + calculateDistance(node, leftSibling));
        } else {
          data.setPrelimForNode(node, 0);
        }
      } else {
        const firstChild = node.getChild(0);
        const lastChild = node.getChild(node.getChildCount() - 1);
        let defaultAncestor = firstChild;
        let previousChild = null;
        for (let i = 0; i < node.getChildCount(); i++) {
          const child = node.getChild(i);
          firstWalk(child, previousChild);
          defaultAncestor = apportion(child, defaultAncestor, previousChild, node);
          previousChild = child;
        }

        executeShifts(node);

        const midPoint = (data.getPrelimForNode(firstChild) + data.getPrelimForNode(lastChild)) / 2;

        if (leftSibling != null) {
          const prelim = data.getPrelimForNode(leftSibling) + calculateDistance(node, leftSibling);
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
    const secondWalk = function (v, m, level, levelStart) {
      const x = data.getPrelimForNode(v) + m;
      const y = levelStart + level * (options.nodeHeight + options.levelSeparation);

      data.setCoordinatesForNode(v, x, y);

      if (!v.isLeaf()) {
        for (let i = 0; i < v.getChildCount(); i++) {
          const child = v.getChild(i);
          secondWalk(child, m + data.getModifierForNode(v), level + 1, levelStart);
        }
      }
    };

    this.getBoundingBox = function (node) {
      if (data != null) {
        return data.getBoundingBox(node);
      }
      return null;
    };

    /**
     * Retrieve the coordinates for a given node in the tree.
     */
    this.getCoordinatesForNode = function (node) {
      if (data !== null) {
        return data.getCoordinatesForNode(node);
      }
      return null;
    };

    /**
     * Retrieve the intermediate layout data for a given node in the tree.
     */
    this.getIntermediateDataForNode = function (node) {
      if (data != null) {
        return data.getAttributesForNode(node);
      }
      return null;
    };

    /**
     * Layout the nodes in a tree, starting at rootNode.
     */
    this.positionTree = function (rootNode, userOptions) {
      const fnOptions = Util.extend({
        stopAfterFirstWalk: false
      }, userOptions);

      data = new TreeLayoutData(options.nodeWidth, options.nodeHeight);

      // Reset bounding box coordinates
      data.xMin = 0;
      data.xMax = 0;
      data.yMin = 0;
      data.yMax = 0;

      if (rootNode !== null) {
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
}

export default TreeLayout;
