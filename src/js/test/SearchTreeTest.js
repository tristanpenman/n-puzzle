
test("test SearchTreeNode construction of a root node", function() {

    // Create root node
    var rootNode = new SearchTreeNode();

    // Test node initialisation state for root nodes
    equal( rootNode.getChildCount(), 0, "Child count should be zero after initialisation");
    equal( rootNode.getChildren().length, 0, "Child array should be empty");
    equal( rootNode.getChild(0), null, "Retrieving a non-existent child (0) should return null");
    equal( rootNode.getIndexOfChild(rootNode), -1, "Getting the index of a non-child node should return -1");
    equal( rootNode.getParent(), null, "Root node should not have a parent");
    equal( rootNode.hasLeftSibling(), false, "Root node should not have a left sibling");
    equal( rootNode.hasRightSibling(), false, "Root node should not have a right sibling");
    equal( rootNode.getLeftSibling(), null, "Retrieving the left sibling of a root node should return null");
    equal( rootNode.getRightSibling(), null, "Retrieving the right sibling of a root node should return null");

});

test("test SearchTreeNode construction of a child node", function() {

    // Create root node
    var rootNode = new SearchTreeNode();

    // Create single child
    var childNode = new SearchTreeNode(rootNode);

    // Test root node relationship to child node
    equal( rootNode.getChildCount(), 1, "Root node should have one child");
    equal( rootNode.getChildren().length, 1, "Length of child array should be one");
    equal( rootNode.getChildren()[0], childNode, "childNode should be in child array");
    equal( rootNode.getIndexOfChild(childNode), 0, "childNode should have an index of zero");

    // Test node initialisation state for root nodes
    equal( childNode.getChildCount(), 0, "Child count should be zero after initialisation");
    equal( childNode.getChild(0), null, "Retrieving a non-existent child (0) should return null");
    equal( childNode.getIndexOfChild(rootNode), -1, "Getting the index of a non-child node should return -1");
    equal( childNode.getParent(), rootNode, "Root node should be the parent of the child node");
    equal( childNode.hasLeftSibling(), false, "Root node should not have a left sibling");
    equal( childNode.hasRightSibling(), false, "Root node should not have a right sibling");
    equal( childNode.getLeftSibling(), null, "Retrieving the left sibling of a root node should return null");
    equal( childNode.getRightSibling(), null, "Retrieving the right sibling of a root node should return null");

});

test("test SearchTreeNode with multiple children", function() {

    // Create root node
    var rootNode = new SearchTreeNode();

    // Create children
    var childNode1 = new SearchTreeNode(rootNode);
    var childNode2 = new SearchTreeNode(rootNode);
    var childNode3 = new SearchTreeNode(rootNode);

    // Test relationships between root node and child nodes
    equal( rootNode.getChildCount(), 3, "rootNode should have three children");
    equal( rootNode.getChild(0), childNode1, "First child of rootNode should be childNode1");
    equal( rootNode.getChild(1), childNode2, "Second child of rootNode should be childNode2");
    equal( rootNode.getChild(2), childNode3, "Third child of rootNode should be childNode3");
    equal( rootNode.getIndexOfChild(childNode1), 0, "childNode1 should have an index of 0");
    equal( rootNode.getIndexOfChild(childNode2), 1, "childNode2 should have an index of 1");
    equal( rootNode.getIndexOfChild(childNode3), 2, "childNode3 should have an index of 2");

    // Test sibling relationships for childNode1
    equal( childNode1.hasLeftSibling(), false, "childNode1 should not have a left sibling");
    equal( childNode1.hasRightSibling(), true, "childNode1 should have a right sibling");
    equal( childNode1.getLeftSibling(), null, "Retrieving left sibling of childNode1 should return null");
    equal( childNode1.getRightSibling(), childNode2, "Retrieving right sibling of childNode1 should return childNode2");

    // Test sibling relationships for childNode2
    equal( childNode2.hasLeftSibling(), true, "childNode2 should have a left sibling");
    equal( childNode2.hasRightSibling(), true, "childNode2 should have a right sibling");
    equal( childNode2.getLeftSibling(), childNode1, "Retrieving left sibling of childNode2 should return childNode1");
    equal( childNode2.getRightSibling(), childNode3, "Retrieving right sibling of childNode2 should return childNode3");

    // Test sibling relationships for childNode3
    equal( childNode3.hasLeftSibling(), true, "childNode3 should have a left sibling");
    equal( childNode3.hasRightSibling(), false, "childNode3 should not have a right sibling");
    equal( childNode3.getLeftSibling(), childNode2, "Retrieving left sibling of childNode2 should return childNode2");
    equal( childNode3.getRightSibling(), null, "Retrieving right sibling of childNode2 should return null");

});

test("test SearchTreeNode for correct handling of a deep heirarchy", function() {
    // TODO
    expect( 0 );
});

test("test SearchTree with Breadth-first search algorithm", function() {
    // TODO
    expect( 0 );
});

test("test SearchTree with Depth-first search algorithm", function() {
    // TODO
    expect( 0 );
});