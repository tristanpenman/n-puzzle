# Bugs

Obvious Bugs / Code Errors

1. Vue components do not react to Backbone model changes.

   `src/js/components/application-view.vue:13` and `src/js/components/control-panel.vue:9` call Backbone getters directly from Vue templates, but the components do not subscribe to `ApplicationState` or `Configuration` changes and do not update reactive Vue state. After `model.start()` mutates the Backbone state, Vue has no reactive dependency to re-render `showTutorial()`, button disabled states, selected heuristic UI, and related controls. `tree-view.vue` listens to `searchTree` changes, but it may never mount if the parent stays on the tutorial view.

2. Search algorithms crash or keep running incorrectly when no solution is found.

   `src/js/models/algorithms/BreadthFirstSearch.js:67`, `src/js/models/algorithms/DepthFirstSearch.js:52`, and `src/js/models/algorithms/InformedSearch.js:89` do not handle an exhausted frontier. For an unsolvable puzzle, BFS/DFS eventually pop `undefined` and then call `isGoalState`, `addToClosedSet`, or `generateSuccessors` on it. Informed search can dequeue `undefined` and then read `node.explored`. The app needs a no-solution terminal state or a solvability check before starting.

3. Euclidean heuristic includes the blank tile.

   `src/js/models/PuzzleState.js:210` computes Euclidean distance for all tiles, including tile `0`, while Manhattan distance and tiles-out explicitly skip the blank tile. This makes the heuristic inconsistent and likely non-admissible for A*, so A* with Euclidean can choose non-optimal paths.

4. Algorithm tests rely on mock-only configuration APIs.

   `src/js/test/AlgorithmTest.js:12` calls `setInitialState()` and `setGoalState()`, but the real `src/js/models/Configuration.js` model does not implement those methods. The tests only pass because `ApplicationStateTest` supplies a mock with extra methods, so they can miss bugs in the real configuration model.

Note: I did not run build, lint, or tests because dependencies are not installed in the workspace and the sandbox was read-only during review.
