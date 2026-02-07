<template>
  <div class="PuzzleStateEditorCell" @click="edit">
    <input
      ref="input"
      v-if="editing"
      v-model="draft"
      @blur="commit"
      @keydown.enter.prevent="commit"
      @keydown.esc.prevent="cancel"
    />
    <div v-else>
      {{value || '-'}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      draft: ''
    };
  },
  methods: {
    edit() {
      if (!this.editing) {
        this.$emit('edit', this.position);
      }
    },
    commit() {
      const parsed = Number(this.draft);
      if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 8) {
        this.$emit('set', this.position, parsed);
        return;
      }
      this.$emit('set', this.position, this.value);
    },
    cancel() {
      this.$emit('set', this.position, this.value);
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
        this.draft = this.value === null || this.value === undefined ? '' : String(this.value);
        this.$nextTick(() => {
          this.$refs.input.focus();
          this.$refs.input.select();
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
