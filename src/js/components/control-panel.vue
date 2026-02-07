<template>
  <div class="ControlPanel">
    <h1><img :src="faviconImage" width="18" height="18"/>N-Puzzle</h1>

    <div class="group initial">
      <label>Initial state:</label>
      <puzzle-state-view v-bind:tiles="getInitialState()"></puzzle-state-view>
      <div class="field">
        <button @click="showModal('initial')" :disabled="getState() !== 'stopped'">Edit state</button>
      </div>
    </div>

    <div class="group goal">
      <label>Goal state:</label>
      <puzzle-state-view v-bind:tiles="getGoalState()"></puzzle-state-view>
      <div class="field">
        <button @click="showModal('goal')" :disabled="getState() !== 'stopped'">Edit state</button>
      </div>
    </div>

    <div class="group algorithm">
      <label>Search algorithm:</label>
      <div class="field">
        <select @change="changeAlgorithm" v-bind:value="getAlgorithm()" :disabled="getState() !== 'stopped'">
          <option
            v-for="algorithm in availableAlgorithms()"
            :key="algorithm.key"
            v-bind:value="algorithm.key"
          >
            {{ algorithm.name }}
          </option>
        </select>
        <button @click="showModal('algorithms')" class="help" :disabled="getState() !== 'stopped'">
          <img :src="helpIconImage" alt="help">
        </button>
      </div>
    </div>

    <div class="group heuristic">
      <label>Heuristic:</label>
      <div class="field">
        <select
          @change="changeHeuristic"
          :disabled="getState() !== 'stopped'"
          :value="getHeuristic()"
          v-if="usesHeuristic()"
        >
          <option
            v-for="heuristic in availableHeuristics()"
            :key="heuristic.key"
            v-bind:value="heuristic.key"
          >
            {{ heuristic.name }}
          </option>
        </select>
        <select v-else disabled>
          <option>
            Not available
          </option>
        </select>
        <button @click="showModal('heuristics')" class="help" :disabled="getState() !== 'stopped'">
          <img :src="helpIconImage" alt="help">
        </button>
      </div>
    </div>

    <div class="group mode">
      <label>Control mode:</label>
      <div class="field">
        <select @change="changeMode" :disabled="getState() !== 'stopped'">
          <option value="single">Single-step</option>
          <option value="burst">Burst mode</option>
        </select>
      </div>
    </div>

    <div class="group stepper">
      <label>Controls:</label>
      <div class="row" v-if="getMode() === 'burst'">
        <button :disabled="getState() !== 'stopped'" @click="$emit('start')">Start</button>
        <button :disabled="getState() === 'stopped' || getState() !== 'paused'" @click="$emit('resume')">Resume</button>
        <button :disabled="getState() === 'stopped' || getState() !== 'running'" @click="$emit('pause')">Pause</button>
      </div>
      <div class="row" v-else>
        <button :disabled="getState() !== 'stopped'" @click="$emit('start')">Start</button>
        <button :disabled="getState() !== 'running'" @click="$emit('next')">Next</button>
        <button :disabled="getState() !== 'running'" @click="$emit('back')">Back</button>
      </div>
      <div class="row">
        <button :disabled="getState() === 'stopped'" @click="$emit('reset')">Reset</button>
      </div>
    </div>

    <!-- modals -->

    <puzzle-state-editor
      v-bind:tiles="getInitialState()"
      v-if="modal === 'initial'"
      @dismiss="hideModal"
      @save="saveInitialState"
    ></puzzle-state-editor>

    <puzzle-state-editor
      v-bind:tiles="getGoalState()"
      v-if="modal === 'goal'"
      @dismiss="hideModal"
      @save="saveGoalState"
    ></puzzle-state-editor>

    <help-modal v-if="modal === 'algorithms'" @dismiss="hideModal">
      <p>The graph-search algorithms in this list fall in to two categories:</p>
      <ul>
        <li>Uninformed algorithms - those that <em>do not</em> make use of a heuristic function</li>
        <li>Informed algorithms - those that <em>do</em> make some use of a heuristic function</li>
      </ul>
      <p>See your lecture notes and the assigned text book to learn more about each algorithm.</p>
    </help-modal>

    <help-modal v-if="modal === 'heuristics'" @dismiss="hideModal">
      <p>When using an informed algorithm, such as A* Search, you must also choose a heuristic.</p>
      <p>You can choose one of three heuristics:</p>
      <ul>
        <li>Euclidean distance - sum of the straight-line distance for each tile out of place</li>
        <li>Manhattan distance - sum of horizontal and vertical distance for each tile out of place</li>
        <li>Tiles-out - the number of tiles that are out of place</li>
      </ul>
    </help-modal>
  </div>
</template>

<script>
import Configuration from '../models/Configuration';

// assets
const faviconImage = new URL('../../images/favicon.png', import.meta.url).href;
const helpIconImage = new URL('../../images/help-icon.png', import.meta.url).href;

export default {
  data() {
    return {
      faviconImage,
      helpIconImage,
      modal: null,
      state: null
    }
  },
  methods: {
    availableAlgorithms() {
      return Object
        .entries(Configuration.getAvailableAlgorithms())
        .map(([key, value]) => ({
          key,
          name: value.name
        }));
    },
    availableHeuristics() {
      return Object
        .entries(Configuration.getAvailableHeuristics())
        .map(([key, value]) => ({
          key,
          name: value.name
        }));
    },
    changeAlgorithm(event) {
      this.model.getConfiguration().setAlgorithm(event.target.value);
    },
    changeHeuristic(event) {
      this.model.getConfiguration().setHeuristic(event.target.value);
    },
    changeMode(event) {
      this.model.getConfiguration().setMode(event.target.value);
    },
    getAlgorithm() {
      return this.model.getConfiguration().getAlgorithm();
    },
    getGoalState() {
      return this.model.getConfiguration().getGoalState().valueOf();
    },
    getHeuristic() {
      return this.model.getConfiguration().getHeuristic();
    },
    getInitialState() {
      return this.model.getConfiguration().getInitialState().valueOf();
    },
    getMode() {
      return this.model.getConfiguration().getMode();
    },
    getState() {
      return this.model.getState();
    },
    hideModal() {
      this.modal = null;
    },
    saveGoalState(tiles) {
      this.model.getConfiguration().getGoalState().copyFrom({tiles});
      this.modal = null;
    },
    saveInitialState(tiles) {
      this.model.getConfiguration().getInitialState().copyFrom({tiles});
      this.modal = null;
    },
    showModal(modal) {
      this.modal = modal;
    },
    usesHeuristic() {
      return Configuration.getAvailableAlgorithms()[this.model.getConfiguration().getAlgorithm()].usesHeuristic;
    }
  },
  props: [
    'model'
  ]
};
</script>

<style>
.ControlPanel {
  background-color: #f2f2f2;
  min-width: 230px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0.9em 0 1em;
}

.ControlPanel > h1 {
  align-items: center;
  border-bottom: 1px solid #aaa;
  display: flex;
  font-size: 22px;
  gap: 6px;
  margin: 1.2em 0 1em 0.2em;
  padding-bottom: 0.2em;
  width: 8.9em;
}

.ControlPanel > h1 > img {
  position: relative;
  top: -1px;
}

.ControlPanel > .group > label {
  display: block;
  font-size: 0.9em;
  margin-bottom: 0.4em;
}

.ControlPanel > .group.disabled > label {
  color: #666;
}

.ControlPanel > .group {
  margin-bottom: 0.7em;
  padding: 0.3em;
}

.ControlPanel > .stepper > .row {
  display: flex;
  gap: 5px;
  margin-bottom: 0.4em;
}

.ControlPanel > .group > .field {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.ControlPanel > .group > .field > button.help {
  border: 0;
  cursor: pointer;
  display: flex;
  padding: 0;
  user-select: none;
}

.ControlPanel > .group > .field > button.help > img {
  margin: auto;
}

.ControlPanel > .group > .field > button.help:disabled {
  cursor: default;
  opacity: 50%;
}

.ControlPanel > .group > .field > select {
  padding: 1px;
  vertical-align: bottom;
}
</style>
