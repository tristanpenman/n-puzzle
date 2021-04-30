<template>
  <div class="ApplicationView">
    <control-panel
      :model="model"
      @back="handleBack"
      @next="handleNext"
      @pause="handlePause"
      @reset="handleReset"
      @resume="handleResume"
      @start="handleStart"
    ></control-panel>
    <div class="main">
      <tutorial v-if="showTutorial()"></tutorial>
      <tree-view v-else :model="model"></tree-view>
    </div>
  </div>
</template>

<script>
module.exports = {
  methods: {
    handleBack() {
      this.model.undo();
    },
    handleNext() {
      this.model.next();
    },
    handlePause() {
      this.model.pause();
    },
    handleReset() {
      this.model.reset();
    },
    handleResume() {
      this.model.resume();
    },
    handleStart() {
      this.model.start();
    },
    showTutorial() {
      return this.model.getTree().getRootNode() === null;
    }
  },
  props: [
    'model'
  ]
};
</script>

<style>
.ApplicationView {
  display: flex;
  height: 100%;
}

.ApplicationView > .main {
  border-left: 1px solid #aaa;
  box-shadow: -1px 0 4px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  height: 100%;
  left: 245px;
  max-height: 100%;
  overflow: auto;
}
</style>
