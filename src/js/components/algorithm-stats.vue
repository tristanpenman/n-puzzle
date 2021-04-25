<template>
  <div class="AlgorithmStats" v-if="state !== 'stopped'">
    <div v-for="stat in statistics">
      {{ stat.name }}: {{ stat.value }}
    </div>
  </div>
</template>

<script>
module.exports = {
  props: [
    'state',
    'statistics'
  ]
};
</script>

<style>
.AlgorithmStats {
  background: #fafafa;
  border-radius: 3px;
  border: 1px solid #aaa;
  font-size: 0.9em;
  margin: 10px;
  padding: 0.5em;
  position: absolute;
  right: 15px;
  top: 15px;
}

.AlgorithmStats > div {
  display: block;
  padding: 0.3em;
}
</style>
