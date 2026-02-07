<template>
  <div class="TreeView" ref="container">
    <!-- where stuff is actually drawn -->
    <canvas class="main" ref="canvas"></canvas>

    <!-- provides scrollbars for a fake scrollable area; avoids resizing canvas -->
    <div class="viewport" ref="viewport">
      <!-- fake scrollable area, resized based on actual size of search tree -->
      <div class="fake" ref="fake"></div>
    </div>

    <algorithm-stats :statistics="model.getStatistics()"></algorithm-stats>
  </div>
</template>

<script>
import PuzzleStateRenderer from '../helpers/PuzzleStateRenderer';
import TreeLayout from '../helpers/TreeLayout';

export default {
  data() {
    return {
      context: null,
      layoutAlgorithm: null,
      nodeColors: {
        culled: '#f0f',       // purple
        explored: '#999',     // grey
        goal: '#0f0',         // green
        goal_path: '#fdbe00', // gold
        next: '#f00',         // red
        normal: '#00f',       // blue
        repeat: '#999',       // grey
      },
      renderer: null,
      scrollbarWidth: 0,
      treeLayoutMarginBottom: 20,
      treeLayoutMarginLeft: 120,
      treeLayoutMarginRight: 120,
      treeLayoutMarginTop: 10
    }
  },
  methods: {
    calculateScrollbarWidth() {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.width = '100px';
      document.body.appendChild(outer);
      const widthNoScroll = outer.offsetWidth;

      // force scrollbars
      outer.style.overflow = 'scroll';

      // add inner div
      const inner = document.createElement('div');
      inner.style.width = '100%';
      outer.appendChild(inner);
      const widthWithScroll = inner.offsetWidth;

      // remove divs
      outer.parentNode.removeChild(outer);

      return widthNoScroll - widthWithScroll;
    },
    drawSubtree(node, coords, xOffset, yOffset, width, height) {
      // Render this state
      const stateColor = this.nodeColors[node.getAttributes().kind] || '#999';
      const x = Math.round(coords.x + xOffset);
      const y = Math.round(coords.y + yOffset);
      const expectedWidth = this.renderer.getExpectedWidth();
      const expectedHeight = this.renderer.getExpectedHeight();

      if (x + expectedWidth >= 0 && x < width && y + expectedHeight >= 0 && y < height) {
        this.renderer.renderState(node.getState(), stateColor, x, y);
      }

      // Recursively render child states
      node.getChildren().forEach((child) => {
        const childCoords = this.layoutAlgorithm.getCoordinatesForNode(child);
        if (childCoords == null) {
          return;
        }

        // Draw a line connecting the parent node to its children
        this.context.beginPath();
        this.context.moveTo(
          Math.round(coords.x + xOffset + expectedWidth / 2) + 0.5,
          coords.y + yOffset + expectedHeight + 1);
        this.context.lineTo(
          Math.round(childCoords.x + xOffset + expectedWidth / 2) + 0.5,
          childCoords.y + yOffset);
        this.context.strokeStyle = '#000';
        this.context.stroke();

        this.drawSubtree(child, childCoords, xOffset, yOffset, width, height);
      });
    },
    drawTree(rootNode) {
      const canvas = this.$refs.canvas;
      const container = this.$refs.container;
      const viewport = this.$refs.viewport;

      // Set canvas attributes so that drawing works properly
      const height = container.clientHeight - this.scrollbarWidth;
      const width = container.clientWidth - this.scrollbarWidth;
      canvas.setAttribute('height', height.toString());
      canvas.setAttribute('width', width.toString());

      // Clear canvas
      this.context.clearRect(0, 0, width, height);

      // Get coordinates for root node
      const coords = this.layoutAlgorithm.getCoordinatesForNode(rootNode);
      if (coords === null) {
        return;
      }

      coords.x = 0;
      coords.y = 0;

      // Find actual size of search tree
      const boundingBox = this.layoutAlgorithm.getBoundingBox();
      const boundingWidth = boundingBox.right - boundingBox.left;
      const boundingHeight = boundingBox.bottom - boundingBox.top;

      // Center the tree in the viewport
      const virtualDoc = {
        x: this.treeLayoutMarginLeft,
        y: this.treeLayoutMarginTop,
        width: Math.max(width - this.treeLayoutMarginLeft - this.treeLayoutMarginRight, boundingWidth),
        height: Math.max(height - this.treeLayoutMarginTop - this.treeLayoutMarginBottom, boundingHeight)
      };

      // Set size of 'fake' content area inside viewport; works with native scrollbars
      const fake = this.$refs.fake;
      fake.style.width = `${(virtualDoc.width + this.treeLayoutMarginLeft + this.treeLayoutMarginRight)}px`;
      fake.style.height = `${(virtualDoc.height + this.treeLayoutMarginTop + this.treeLayoutMarginBottom)}px`;

      // calculate drawing offset
      const xOffset = Math.max((width - boundingWidth) / 2, this.treeLayoutMarginLeft)
        - boundingBox.left - viewport.scrollLeft;
      const yOffset = this.treeLayoutMarginTop - boundingBox.top - viewport.scrollTop;

      this.drawSubtree(rootNode, coords, xOffset, yOffset, width, height);
    },
    justRedraw() {
      this.drawTree(this.model.getTree().getRootNode());
    },
    layoutAndRedraw() {
      const rootNode = this.model.getTree().getRootNode();
      this.layoutAlgorithm.positionTree(rootNode);
      this.drawTree(rootNode);
    }
  },
  mounted() {
    this.scrollbarWidth = this.calculateScrollbarWidth();

    this.context = this.$refs.canvas.getContext('2d');
    if (!this.context) {
      return;
    }

    // setup renderer, which is used to draw individual states, and the layout algorithm, which is used to
    // calculate the position of each node in the tree
    this.renderer = new PuzzleStateRenderer(this.context);
    this.layoutAlgorithm = new TreeLayout({
      nodeHeight: this.renderer.getExpectedHeight(),
      nodeWidth: this.renderer.getExpectedWidth(),
    });

    // re-draw the tree whenever the canvas is resized or scrolled
    window.addEventListener('resize', this.justRedraw);
    this.$refs.viewport.addEventListener('scroll', this.justRedraw);

    // re-calculate layout when the tree changes
    this.model.getTree().on('change', this.layoutAndRedraw);

    // initial layout and draw of the tree
    this.layoutAndRedraw();
  },
  beforeUnmount() {
    // remove dom event listeners
    window.removeEventListener('resize', this.justRedraw);
    this.$refs.viewport.removeEventListener('scroll', this.justRedraw);

    // remove model event listener
    this.model.getTree().off('change', this.layoutAndRedraw);
  },
  props: [
    'model'
  ]
};
</script>

<style>
.TreeView {
  background: var(--color-bg);
  height: 100%;
  position: relative;
}

.TreeView > canvas {
  left: 0;
  position: absolute;
  top: 0;
}

.TreeView > .viewport {
  height: 100%;
  left: 0;
  overflow: scroll;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
