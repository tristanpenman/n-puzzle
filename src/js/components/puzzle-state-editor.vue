<template>
  <div class="PuzzleStateEditor">
    <div class="popup">
      <div class="grid">
        <div class="row" v-for="y in [0, 1, 2]">
          <div class="cell" v-for="x in [0, 1, 2]">
            <puzzle-state-editor-cell
              v-bind:editing="editing && editing[0] === x && editing[1] === y"
              v-bind:position="[x, y]"
              v-bind:value="unsaved.getTile(x, y)"
              v-on:edit="edit"
              v-on:set="set"
            />
          </div>
        </div>
      </div>
      <div class="actions">
        <input type="button" value="Save Changes" v-on:click="save" />
        <a href="#" v-on:click="discard">Discard</a>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      editing: null,
      unsaved: new PuzzleState().setTiles(this.tiles)
    }
  },
  methods: {
    discard() {
      this.unsaved = new PuzzleState().setTiles(this.tiles);
      this.$emit('dismiss');
    },
    edit(position) {
      this.editing = position;
    },
    save() {
      this.$emit('save', this.unsaved.valueOf());
    },
    set(position, value) {
      this.editing = null;
      this.unsaved.setTile(position[0], position[1], value);
    }
  },
  props: [
    'tiles'
  ]
};
</script>

<style>
.PuzzleStateEditor {
  background: rgba(70, 70, 70, 0.5);
  display: flex;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.PuzzleStateEditor > .popup {
  background: #333;
  border-radius: 4px;
  margin: auto;
  padding: 16px;
}

.PuzzleStateEditor > .popup > .grid {
  background: #666;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding-left: 2px;
  padding-top: 2px;
}

.PuzzleStateEditor > .popup > .grid > .row {
  display: flex;
  flex-grow: 1;
}

.PuzzleStateEditor > .popup > .grid > .row > .cell {
  margin-bottom: 2px;
  margin-right: 2px;
}

.PuzzleStateEditor > .popup > .grid > .row > .cell:hover {
  background: #fcf3d0;
  cursor: pointer;
}

.PuzzleStateEditor > .popup > .actions {
  align-items: center;
  display: flex;
}

.PuzzleStateEditor > .popup > .actions > input {
  margin-right: 12px;
}

.PuzzleStateEditor > .popup > .actions > a {
  color: #fff;
  text-decoration: none;
}

.PuzzleStateEditor > .popup > .actions > a:hover {
  text-decoration: underline;
}
</style>
