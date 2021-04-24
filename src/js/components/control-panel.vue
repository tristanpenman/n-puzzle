<template>
  <div class="ControlPanel">
    <h1>N-Puzzle</h1>

    <div class="group initial">
      <label>Initial state:</label>
      <puzzle-state-view v-bind:tiles="getInitialState()"></puzzle-state-view>
      <div class="field">
        <button @click="showModal('initial')" :disabled="state !== 'stopped'">Edit state</button>
      </div>
    </div>

    <div class="group goal">
      <label>Goal state:</label>
      <puzzle-state-view v-bind:tiles="getGoalState()"></puzzle-state-view>
      <div class="field">
        <button @click="showModal('goal')" :disabled="state !== 'stopped'">Edit state</button>
      </div>
    </div>

    <div class="group algorithm">
      <label>Search algorithm:</label>
      <div class="field">
        <select @change="changeAlgorithm" v-bind:value="configuration.getAlgorithm()" :disabled="state !== 'stopped'">
          <option v-for="algorithm in availableAlgorithms()" v-bind:value="algorithm.key">
            {{ algorithm.name }}
          </option>
        </select>
        <button @click="showModal('algorithms')" class="help" :disabled="state !== 'stopped'">
          <img src="images/help_icon.gif" alt="help">
        </button>
      </div>
    </div>

    <div class="group heuristic">
      <label>Heuristic:</label>
      <div class="field">
        <select
          @change="changeHeuristic"
          :disabled="state !== 'stopped'"
          :value="configuration.getHeuristic()"
          v-if="usesHeuristic()"
        >
          <option v-for="heuristic in availableHeuristics()" v-bind:value="heuristic.key">
            {{ heuristic.name }}
          </option>
        </select>
        <select v-else disabled>
          <option>
            Not available
          </option>
        </select>
        <button @click="showModal('heuristics')" class="help" :disabled="state !== 'stopped'">
          <img src="images/help_icon.gif" alt="help">
        </button>
      </div>
    </div>

    <div class="group mode">
      <label>Control mode:</label>
      <div class="field">
        <select @change="changeMode" :disabled="state !== 'stopped'">
          <option value="single">Single-step</option>
          <option value="burst">Burst mode</option>
        </select>
      </div>
    </div>

    <div class="group stepper">
      <label>Controls:</label>
      <div class="row" v-if="getMode() === 'burst'">
        <button :disabled="state !== 'stopped'" @click="$emit('start')">Start</button>
        <button :disabled="state === 'stopped' || state !== 'paused'" @click="$emit('resume')">Resume</button>
        <button :disabled="state === 'stopped' || state !== 'running'" @click="$emit('pause')">Pause</button>
      </div>
      <div class="row" v-else>
        <button :disabled="state !== 'stopped'" @click="$emit('start')">Start</button>
        <button :disabled="state !== 'running'" @click="$emit('next')">Next</button>
        <button :disabled="state !== 'running'" @click="$emit('back')">Back</button>
      </div>
      <div class="row">
        <button :disabled="state === 'stopped'" @click="$emit('reset')">Reset</button>
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
module.exports = {
  data() {
    return {
      modal: null
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
      this.configuration.setAlgorithm(event.target.value);
    },
    changeHeuristic(event) {
      this.configuration.setHeuristic(event.target.value);
    },
    changeMode(event) {
      this.configuration.setMode(event.target.value);
    },
    getGoalState() {
      return this.configuration.getGoalState().valueOf();
    },
    getInitialState() {
      return this.configuration.getInitialState().valueOf();
    },
    getMode() {
      return this.configuration.getMode();
    },
    hideModal() {
      this.modal = null;
    },
    saveGoalState(tiles) {
      this.configuration.getGoalState().copyFrom({tiles});
      this.modal = null;
    },
    saveInitialState(tiles) {
      this.configuration.getInitialState().copyFrom({tiles});
      this.modal = null;
    },
    showModal(modal) {
      this.modal = modal;
    },
    usesHeuristic() {
      return Configuration.getAvailableAlgorithms()[this.configuration.getAlgorithm()].usesHeuristic;
    }
  },
  props: [
    'configuration',
    'state'
  ]
};
</script>

<style>
.ControlPanel {
  background-color: #f2f2f2;
  height: 100%;
  min-width: 230px;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0.9em 0 1em;
}

.ControlPanel > h1 {
  border-bottom: 1px solid #aaa;
  font-size: 22px;
  padding-bottom: 0.2em;
}

.ControlPanel > .group.disabled label {
  color: #666;
}

.ControlPanel > .group {
  padding: 0.3em;
  margin-bottom: 0.7em;
}

.ControlPanel > .stepper > .row {
  margin-bottom: 0.4em;
}

.ControlPanel > .group > .field > button.help {
  border: 0;
  cursor: pointer;
  padding: 0;
  user-select: none;
}

.ControlPanel > .group > .field > button.help:disabled {
  cursor: default;
  opacity: 50%;
}
</style>
