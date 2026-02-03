# N-Puzzle

N-Puzzle is a web app for learning about graph-based search algorithms.

We use the 8-puzzle, which is an instance of the [Sliding Puzzle](https://en.wikipedia.org/wiki/Sliding_puzzle) problem, where eight tiles are placed on a 3x3 grid. The remaining position is an empty space. Tiles adjacent to the empty space may be moved into that space. The puzzle is solved by finding a sequence of moves (state transitions) that will allow us to move from the initial state to the goal state.

An example initial state and goal state are given below:

**Initial state**:

    2 3 -
    4 5 1
    6 7 8

**Goal state**:

    2 5 3
    4 7 -
    6 8 1

N-Puzzle provides five algorithms that can be used to solve the problem:

- Breadth-first Search (BFS)
- Depth-first Search (DFS)
- Iterative Deepening DFS (ID-DFS)
- Greedy Search
- A* Search

Since Greedy Search and A* Search are informed search algorithms, three
heuristic functions are also provided:

- Euclidean distance heuristic
- Manhattan distance heuristic
- Tiles-out heuristic

## Demo

A live demo is available [here](http://tristanpenman.com/demos/n-puzzle).

## Development

N-Puzzle has been built using [Vue.js](https://vuejs.org/), using Vue [Single File Components](https://vuejs.org/guide/scaling-up/sfc.html).

The project now uses [Vite](https://vitejs.dev/) for local development and builds.

To run the dev server:

    npm install
    npm run dev

Vite will print the local URL (typically http://localhost:5173) in the terminal. If you change any of the code, simply refresh the page to see your changes.

To build a production version:

    npm run build

You can also preview the production build locally:

    npm run preview

## Acknowledgements

N-Puzzle is based on the AI-Search Java applet developed at RMIT University by Vic Ciesielski, James Harland and Peter McDonald. The original applet can found at: http://www.cs.rmit.edu.au/AI-Search/

## License

N-Puzzle is distributed under the 3-Clause BSD License. See the LICENSE file for more information.
