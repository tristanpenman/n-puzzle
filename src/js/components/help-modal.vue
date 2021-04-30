<template>
  <div class="HelpModal" @click="close">
    <div class="popup">
      <slot></slot>
      <div class="actions">
        <button @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  methods: {
    close() {
      this.$emit('dismiss');
    }
  }
};
</script>

<style>
.HelpModal {
  background: rgba(70, 70, 70, 0.5);
  display: flex;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.HelpModal > .popup {
  background: #333;
  border-radius: 4px;
  color: white;
  margin: auto;
  padding: 25px 25px 15px 25px;
}

.HelpModal > .popup > .actions {
  padding-top: 10px;
  text-align: center;
}
</style>
