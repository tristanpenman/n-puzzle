PuzzleStateView = Backbone.View.extend({

    initialize: function() {
        this.render();
        this.model.on('change', this.render, this);
    },

    render: function() {
        var cells = this.$el.find('.cell');
        var cell_height = cells.height();
        var cell_values = cells.find('.cell_value');
        cell_values.css('top', Math.round((cell_height - cell_values.height()) / 2) + "px");
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var tile = this.model.getTile(x, y);
                if (tile == 0) {
                    tile = '\u2012';
                }
                this.$el.find('.cell.cell_' + x + '_' + y + ' .cell_value').html(tile);
            }
        }
    }

});
