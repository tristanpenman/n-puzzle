# N-Puzzle

N-Puzzle is a web app for learning about graph-based search algorithms.

This app uses the 8-puzzle to visualise the behaviour of various graph-based search algorithms. The 8-puzzle is an instance of the n-puzzle problem, where eight tiles are placed on a 3x3 grid. The remaining un-tiled position is an empty space. Tiles adjacent to the empty space may be moved into that space. The puzzle is solved by finding a sequence of moves that will transform the initial state into the given goal state.

An example initial state and goal state are given below:

Initial state:

      2 3 -
      4 5 1
      6 7 8

Goal state:

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

A live demo is available at:
http://tristanpenman.com/demos/n-puzzle

## Development

The current version of N-Puzzle has been built using [Vue.js](https://vuejs.org/).

Unlike many modern web apps, N-Puzzle does not require tools such as Webpack for development. You can simply host the code in `/src` using a local web server. MDN has a page that describes several ways to set up a local web server: [How do you set up a local testing server?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)

Using Python as an example, getting the code and hosting N-Puzzle locally could be as simple as:

    git clone https://github.com/tristanpenman/n-puzzle.git
    cd n-puzzle/src
    python3 -m http.server

You would then be able to go to the URL http://localhost:8000 in your browser to use the app. If you change any of the code, simply refresh the page to see your changes.

## License

N-Puzzle is distributed under the 3-Clause BSD License. See the LICENSE file for more information.

## Acknowledgements

N-Puzzle is based on the AI-Search Java applet developed at RMIT University by Vic Ciesielski, James Harland and Peter McDonald. The original applet can found at: http://www.cs.rmit.edu.au/AI-Search/

The first version of N-Puzzle was built using jQuery, and has been tagged as the official [v1.0 release](https://github.com/tristanpenman/n-puzzle/releases/tag/v1.0).
