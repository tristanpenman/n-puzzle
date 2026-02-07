import { test } from 'qunit';

import { SearchTreeNode } from '../models/SearchTree';

test("test SearchTreeNode construction of a root node", (assert) => {
  // Create root node
  const rootNode = new SearchTreeNode();

  // Test node initialisation state for root nodes
  assert.equal(rootNode.getChildCount(), 0, "Child count should be zero after initialisation");
  assert.equal(rootNode.getChildren().length, 0, "Child array should be empty");
  assert.equal(rootNode.getChild(0), null, "Retrieving a non-existent child (0) should return null");
  assert.equal(rootNode.getIndexOfChild(rootNode), -1, "Getting the index of a non-child node should return -1");
  assert.equal(rootNode.getParent(), null, "Root node should not have a parent");
  assert.equal(rootNode.hasLeftSibling(), false, "Root node should not have a left sibling");
  assert.equal(rootNode.hasRightSibling(), false, "Root node should not have a right sibling");
  assert.equal(rootNode.getLeftSibling(), null, "Retrieving the left sibling of a root node should return null");
  assert.equal(rootNode.getRightSibling(), null, "Retrieving the right sibling of a root node should return null");
});

test("test SearchTreeNode construction of a child node", (assert) => {
  // Create root node
  const rootNode = new SearchTreeNode();

  // Create single child
  const childNode = new SearchTreeNode(rootNode);

  // Test root node relationship to child node
  assert.equal(rootNode.getChildCount(), 1, "Root node should have one child");
  assert.equal(rootNode.getChildren().length, 1, "Length of child array should be one");
  assert.equal(rootNode.getChildren()[0], childNode, "childNode should be in child array");
  assert.equal(rootNode.getIndexOfChild(childNode), 0, "childNode should have an index of zero");

  // Test node initialisation state for root nodes
  assert.equal(childNode.getChildCount(), 0, "Child count should be zero after initialisation");
  assert.equal(childNode.getChild(0), null, "Retrieving a non-existent child (0) should return null");
  assert.equal(childNode.getIndexOfChild(rootNode), -1, "Getting the index of a non-child node should return -1");
  assert.equal(childNode.getParent(), rootNode, "Root node should be the parent of the child node");
  assert.equal(childNode.hasLeftSibling(), false, "Root node should not have a left sibling");
  assert.equal(childNode.hasRightSibling(), false, "Root node should not have a right sibling");
  assert.equal(childNode.getLeftSibling(), null, "Retrieving the left sibling of a root node should return null");
  assert.equal(childNode.getRightSibling(), null, "Retrieving the right sibling of a root node should return null");
});

test("test SearchTreeNode with multiple children", (assert) => {
  // Create root node
  const rootNode = new SearchTreeNode();

  // Create children
  const childNode1 = new SearchTreeNode(rootNode);
  const childNode2 = new SearchTreeNode(rootNode);
  const childNode3 = new SearchTreeNode(rootNode);

  // Test relationships between root node and child nodes
  assert.equal(rootNode.getChildCount(), 3, "rootNode should have three children");
  assert.equal(rootNode.getChild(0), childNode1, "First child of rootNode should be childNode1");
  assert.equal(rootNode.getChild(1), childNode2, "Second child of rootNode should be childNode2");
  assert.equal(rootNode.getChild(2), childNode3, "Third child of rootNode should be childNode3");
  assert.equal(rootNode.getIndexOfChild(childNode1), 0, "childNode1 should have an index of 0");
  assert.equal(rootNode.getIndexOfChild(childNode2), 1, "childNode2 should have an index of 1");
  assert.equal(rootNode.getIndexOfChild(childNode3), 2, "childNode3 should have an index of 2");

  // Test sibling relationships for childNode1
  assert.equal(childNode1.hasLeftSibling(), false, "childNode1 should not have a left sibling");
  assert.equal(childNode1.hasRightSibling(), true, "childNode1 should have a right sibling");
  assert.equal(childNode1.getLeftSibling(), null, "Retrieving left sibling of childNode1 should return null");
  assert.equal(childNode1.getRightSibling(), childNode2, "Retrieving right sibling of childNode1 should return childNode2");

  // Test sibling relationships for childNode2
  assert.equal(childNode2.hasLeftSibling(), true, "childNode2 should have a left sibling");
  assert.equal(childNode2.hasRightSibling(), true, "childNode2 should have a right sibling");
  assert.equal(childNode2.getLeftSibling(), childNode1, "Retrieving left sibling of childNode2 should return childNode1");
  assert.equal(childNode2.getRightSibling(), childNode3, "Retrieving right sibling of childNode2 should return childNode3");

  // Test sibling relationships for childNode3
  assert.equal(childNode3.hasLeftSibling(), true, "childNode3 should have a left sibling");
  assert.equal(childNode3.hasRightSibling(), false, "childNode3 should not have a right sibling");
  assert.equal(childNode3.getLeftSibling(), childNode2, "Retrieving left sibling of childNode2 should return childNode2");
  assert.equal(childNode3.getRightSibling(), null, "Retrieving right sibling of childNode2 should return null");
});

test("test SearchTreeNode for correct handling of a deep heirarchy", (assert) => {
  // TODO
  assert.expect(0);
});

test("test SearchTree with Breadth-first search algorithm", (assert) => {
  // TODO
  assert.expect(0);
});

test("test SearchTree with Depth-first search algorithm", (assert) => {
  // TODO
  assert.expect(0);
});
