<template>
  <div class="Tutorial">
    <h1>Welcome to N-Puzzle</h1>
    <p>This web application allows you to view a graphical representation of a range of different graph search
      algorithms, whilst solving your choice of 8-puzzle problems.</p>
    <h2>Getting Started</h2>
    <p>On the left-hand side of this application, you will see the <em>Control Panel</em>. Using the <em>Control
      Panel</em>, you can configure the following aspects of the application:</p>
    <ul>
      <li>Initial State and Goal State</li>
      <li>Which Search Algorithm to use</li>
      <li>Which Heuristic Function to use, if using an Informed Search Algorithm</li>
      <li>And whether to use single-step or burst mode</li>
    </ul>
    <p>Each of these options will be described in more detail below.</p>
    <h3>Initial and Goal States</h3>
    <p>To set the Initial or Goal states, you can click either the 'Edit state' button or the graphical representation
      of the state.</p>
    <p>You should see a popup like the following:</p>
    <img src="images/choose-state.png" width="130" height="161">
    <p>To change a tile, simply click on the tile that you would like to replace, then enter the new value on your
      keyboard. This will swap the tile with the one that previously held that value.</p>
    <h3>Search Algorithm</h3>
    <p>N-Puzzle supports five different Graph-based Search Algorithms. The first three are <em>Uninformed</em> Search
      Algorithms:</p>
    <ul>
      <li>Breadth-first Search</li>
      <li>Depth-first Search</li>
      <li>Iterative Deepening Search</li>
    </ul>
    <p>The other two are <em>Informed</em> Search Algorithms:</p>
    <ul>
      <li>A* Search</li>
      <li>Greedy Search</li>
    </ul>
    <p>If you choose an Informed Search Algorithm, then you will also need to select a Heuristic Function.</p>
    <h3>Heuristic Function</h3>
    <p>N-Puzzle supports three different Heuristic Functions:</p>
    <ul>
      <li>Euclidean Distance</li>
      <li>Manhattan Distance (City-Block distance)</li>
      <li>Tiles Out-of-place</li>
    </ul>
    <h3>Single-Step or Burst Mode</h3>
    <p>N-Puzzle can be used in two modes. The default is Single-Step mode, which allows you to 'rewind' a search, one
      step at a time. This is useful for getting a better understanding of how a Search Algorithm works.</p>
    <p>The other mode is Burst Mode. Once started, Burst Mode continues running a search until the goal state has been
      found. A Burst Mode search can be paused, but cannot be 'rewound'.</p>
    <h2>The Search Tree</h2>
    <h3>State Representation</h3>
    <p>While a search is active, you will be able to see a visual representation of the search tree. Each node in this
      search tree represents an arrangement of tiles (or <em>state</em>), and is drawn as a box that is split into 4
      sections.</p>
    <p>The following diagram shows a node taken from a Greedy search:</p>
    <img src="images/state-representation.png">
    <p>The largest section is the puzzle state. Below that you will see two smaller sections.</p>
    <p>Below the puzzle state are two sections. The section on the left is the <em>depth</em> of the node. The section
      on the right is the heuristic score. The heuristic score is only used with Informed Search Algorithms, so if you
      are using Breadth-first, Depth-first or Iterative Deepening Search, the heuristic score will be omitted.</p>
    <p>The last section records the order in which nodes were expanded. For example, the root node will always be '#1',
      and the next node to expanded will be marked as '#2'.</p>
    <h3>Node Colours</h3>
    <p>To help make the Search Tree more 'readable', the border of each node is colour-coded based on its current
      state.</p>
    <p>The following diagram shows the A* algorithm (with the Euclidean distance heuristic) applied to a problem that
      can be solved in just two moves:</p>
    <img src="images/astar-steps.png">
    <p>The colours can be interpreted as follows:</p>
    <table>
      <thead>
      <tr>
        <th>Colour</th>
        <th>Meaning</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Blue</td>
        <td>If a node is in the Open List then it will be highlighted in blue.</td>
      </tr>
      <tr>
        <td>Red</td>
        <td>After each iteration of a search algorithm, the node that will be expanded next will be highlighted in red.
          This applies even when the goal node has been found.
        </td>
      </tr>
      <tr>
        <td>Grey</td>
        <td>If a state has been explored, it will be greyed out. For example, in step 2) of the diagram above, the
          initial state has been coloured grey to indicate that it has been explored. In step 3), a node representing
          the initial state is rediscovered but it will not be expanded since the initial state has been expanded via
          the root node.
        </td>
      </tr>
      <tr>
        <td>Green</td>
        <td>Once the goal state has been found, it will be highlighted in green.</td>
      </tr>
      <tr>
        <td>Gold</td>
        <td>Once a node representing the goal state has been found, any nodes on the path back to the root node will be
          highlighted in gold.
        </td>
      </tr>
      <tr>
        <td>Purple</td>
        <td>When using Iterative Deepening Search, unexplored nodes that exceed the maximum depth will not be added to
          the open list. These nodes will be colored purple.
        </td>
      </tr>
      </tbody>
    </table>
    <h3>Open and Closed Lists</h3>
    <p>While the search algorithms are running, two lists are maintained. The first is the Open List - this is used to
      keep track of nodes that have been discovered, but not yet explorered.</p>
    <p>The second is the Closed List - this is used to keep track of nodes that have been explored, or nodes that will
      not be explored because they represent states that have already been explored via other nodes.</p>
    <p>When a search is active, the number of nodes in the Open and Closed Lists will be visible in the top-left
      corner:</p>
    <img src="images/stats.png">
    <h2>Credits</h2>
    <p>N-Puzzle was developed by Tristan Penman. The source code can be on <a
      href="https://github.com/tristanpenman/n-puzzle">Github</a>, and is distributed under the Simplified BSD License.
      See the LICENSE file included in the source code for more information.</p>
    <p>This project is based on the <a href="http://www.cs.rmit.edu.au/AI-Search">AI-Search Java applet</a> developed at
      RMIT University by Vic Ciesielski, James Harland and Peter McDonald.</p>
  </div>
</template>

<style>
.Tutorial {
  padding-left: 1.7em;
  padding-right: 2em;
  padding-bottom: 2.5em;
}

.Tutorial > p {
  line-height: 22px;
  font-size: 14px;
  margin-top: 7px;
}

.Tutorial > h1 {
  width: auto;
  margin: 1.2em 0 1em 0;
  font-size: 22px;
}

.Tutorial > h2 {
  margin-top: 22px;
  margin-bottom: 17px;
  font-size: 19px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
  font-weight: normal;
}

.Tutorial > h3 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
}

.Tutorial > ul {
  margin-top: 0.6em;
}

.Tutorial > ul > li {
  margin-top: 0.4em;
  font-size: 14px;
}

.Tutorial > img {
  margin-top: 5px;
}

.Tutorial > table {
  border-collapse: collapse;
  margin-top: 1em;
  max-width: 780px;
  margin-bottom: 2em;
}

.Tutorial > table,
.Tutorial > table > tbody > tr > td,
.Tutorial > table > thead > tr > th {
  border: 1px solid #999;
  line-height: 20px;
}

.Tutorial > table > tbody > tr > td,
.Tutorial > table > thead > tr > th {
  padding: 6px 10px;
  text-align: left;
  line-height: 22px;
  font-size: 14px;
}

.Tutorial > table > thead > tr > th {
  background: #f2f2f2;
  padding-top: 0.7em;
  padding-bottom: 0.7em;
}
</style>
