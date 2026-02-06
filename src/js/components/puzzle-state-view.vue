<template>
  <div class="PuzzleStateView" @click="$emit('click')">
    <div class="row">
      <div class="cell">{{ tiles[0] || '-' }}</div>
      <div class="cell">{{ tiles[1] || '-' }}</div>
      <div class="cell">{{ tiles[2] || '-' }}</div>
    </div>
    <div class="row">
      <div class="cell">{{ tiles[3] || '-' }}</div>
      <div class="cell">{{ tiles[4] || '-' }}</div>
      <div class="cell">{{ tiles[5] || '-' }}</div>
    </div>
    <div class="row">
      <div class="cell">{{ tiles[6] || '-' }}</div>
      <div class="cell">{{ tiles[7] || '-' }}</div>
      <div class="cell">{{ tiles[8] || '-' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'tiles',
  ]
};
</script>

<style>
.PuzzleStateView {
  background: #999;
  border: 1px solid #999;
  border-radius: 0.3em;
  display: inline-block;
  font-size: 12px;
  margin-bottom: 0.5em;
}

.PuzzleStateView > .row {
  display: flex;
  margin-bottom: 1px;
}

.PuzzleStateView > .row:last-child {
  margin-bottom: 0;
}

.PuzzleStateView > .row > .cell {
  align-items: center;
  background: #fff;
  display: inline-flex;
  height: 29px;
  justify-content: center;
  margin-right: 1px;
  width: 29px;
}

.PuzzleStateView > .row > .cell:last-child {
  margin-right: 0;
}

.PuzzleStateView > .row:first-child > .cell:first-child {
  border-top-left-radius: 3px;
}

.PuzzleStateView > .row:first-child > .cell:last-child {
  border-top-right-radius: 3px;
}

.PuzzleStateView > .row:last-child > .cell:first-child {
  border-bottom-left-radius: 3px;
}

.PuzzleStateView > .row:last-child > .cell:last-child {
  border-bottom-right-radius: 3px;
}
</style>
