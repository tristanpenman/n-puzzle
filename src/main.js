import Vue from 'vue/dist/vue.esm.js';
import Util from './js/helpers/Util';
import PuzzleStateRenderer from './js/helpers/PuzzleStateRenderer';
import TreeLayout from './js/helpers/TreeLayout';
import ApplicationState from './js/models/ApplicationState';
import Configuration from './js/models/Configuration';
import PuzzleState from './js/models/PuzzleState';
import SearchTree, { SearchTreeNode } from './js/models/SearchTree';
import BreadthFirstSearch from './js/models/algorithms/BreadthFirstSearch';
import DepthFirstSearch from './js/models/algorithms/DepthFirstSearch';
import IterativeDeepeningSearch from './js/models/algorithms/IterativeDeepeningSearch';
import InformedSearch from './js/models/algorithms/InformedSearch';
import GreedySearch from './js/models/algorithms/GreedySearch';
import AStarSearch from './js/models/algorithms/AStarSearch';
import AlgorithmStats from './js/components/algorithm-stats.vue';
import ApplicationView from './js/components/application-view.vue';
import ControlPanel from './js/components/control-panel.vue';
import HelpModal from './js/components/help-modal.vue';
import PuzzleStateEditor from './js/components/puzzle-state-editor.vue';
import PuzzleStateEditorCell from './js/components/puzzle-state-editor-cell.vue';
import PuzzleStateView from './js/components/puzzle-state-view.vue';
import TreeView from './js/components/tree-view.vue';
import Tutorial from './js/components/tutorial.vue';

Vue.component('algorithm-stats', AlgorithmStats);
Vue.component('application-view', ApplicationView);
Vue.component('control-panel', ControlPanel);
Vue.component('help-modal', HelpModal);
Vue.component('puzzle-state-editor', PuzzleStateEditor);
Vue.component('puzzle-state-editor-cell', PuzzleStateEditorCell);
Vue.component('puzzle-state-view', PuzzleStateView);
Vue.component('tree-view', TreeView);
Vue.component('tutorial', Tutorial);

window.addEventListener('load', () => {
  // Set up the default configuration
  const configuration = new Configuration();
  configuration.getInitialState().setTiles([0, 2, 3, 1, 4, 5, 8, 7, 6]);
  configuration.getGoalState().setTiles([1, 2, 3, 8, 0, 4, 7, 6, 5]);

  // Initialise the application view
  new Vue({
    el: document.getElementById('app'),
    data: {
      model: new ApplicationState({
        'configuration': configuration
      })
    },
    template: `
        <application-view :model="model"></application-view>
      `
  });
});

void [
  Util,
  PuzzleStateRenderer,
  TreeLayout,
  PuzzleState,
  SearchTree,
  SearchTreeNode,
  BreadthFirstSearch,
  DepthFirstSearch,
  IterativeDeepeningSearch,
  InformedSearch,
  GreedySearch,
  AStarSearch
];
