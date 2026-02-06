<template>
  <div class="PuzzleStateEditorCell" @click="edit">
    <input
      ref="input"
      v-if="editing"
      @blur="blur"
      @keydown="keydown"
    />
    <div v-else>
      {{value || '-'}}
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    blur() {
      this.$emit('set', this.position, this.value);
    },
    edit() {
      if (!this.editing) {
        this.$emit('edit', this.position);
      }
    },
    keydown(event) {
      if (event.key >= '0' && event.key <= '9') {
        this.$emit('set', this.position, parseInt(event.key, 10));
      } else {
        this.$emit('set', this.position, this.value);
      }
    }
  },
  props: [
    'editing',
    'position',
    'value'
  ],
  watch: {
    'editing': function(editing) {
      if (editing) {
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
    }
  }
}
</script>

<style>
.PuzzleStateEditorCell {
  align-items: center;
  background: #fff;
  display: flex;
  flex-grow: 1;
  font-size: 20px;
  height: 68px;
  justify-content: center;
  width: 68px;
}

.PuzzleStateEditorCell:hover {
  background: #fcf3d0;
  cursor: pointer;
}

.PuzzleStateEditorCell > input {
  background-color: transparent;
  border-color: transparent;
  border-style: none;
  font-size: 20px;
  width: 0.8em;
}

.PuzzleStateEditorCell > input:focus {
  outline: none;
}
</style>
