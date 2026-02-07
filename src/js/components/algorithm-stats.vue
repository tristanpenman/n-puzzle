<template>
  <div class="AlgorithmStats">
    <div v-for="stat in statistics" :key="stat.name">
      {{ stat.name }}: {{ stat.value }}
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'statistics'
  ]
};
</script>

<style>
.AlgorithmStats {
  background: #fafafa;
  border-radius: 3px;
  border: 1px solid #aaa;
  left: 15px;
  margin: 10px;
  padding: 0.5em;
  position: absolute;
  top: 15px;
}

.AlgorithmStats > div {
  display: block;
  padding: 0.3em;
}
</style>
