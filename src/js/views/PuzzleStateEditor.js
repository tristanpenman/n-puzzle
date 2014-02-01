PuzzleStateEditor = Backbone.View.extend({

    events: {
        'click a': 'cancelClicked',
        'click input.save': 'saveClicked'
    },

    initialize: function() {

        this.activeCell = null;

        this.$el.modal({
            'containerId': 'puzzle_state_editor_container',
            'overlayId': 'puzzle_state_editor_overlay',
            'closeHTML': '<a title="Discard changes"></a>',
            'closeClass': 'close',
            'autoPosition': false,
            'onClose': _.bind(this.cancelClicked, this)
        });

        $(window).resize(_.bind(this.autoPosition, this));

        // Reposition container after it has been resized
        $.modal.setPosition();

        // Make a local copy of the model that we can modify without
        // stomping all over the current configuration
        this.localModel = new PuzzleState();
        this.localModel.copyFrom(this.model);

        // Vertically center cell values
        var $cells = this.$el.find('.cell');
        var cellHeight = $cells.height();
        var $cellValues = $cells.find('.cell_value');
        $cellValues.css('top', Math.round((cellHeight - $cellValues.height()) / 2) + "px");

        // Attach click handlers to each cell
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var $cell = this.$el.find('.cell_' + x + '_' + y);
                var $cellValue = $cell.find('.cell_value');
                var clickHandler = _.bind(this.cellClicked, this, x, y);
                $cell.click(clickHandler);
                $cellValue.click(clickHandler);
            }
        }

        this.render();
    },

    autoPosition: function() {

        // Update container position
        var container = $('#puzzle_state_editor_container');
        var x = ($(window).innerWidth() - container.outerWidth()) / 2;
        var y = ($(window).innerHeight() - (container.outerHeight() + 80)) / 2;
        if (y < 0) {
            y = 0;
        }
        container
            .css('top', y)
            .css('left', x);

        // Using percentage sizes renders faster than pixel sizes,
        // which is the method used internally by jquery.simplemodal.
        // TODO: This could cause compatibility issues, so it should
        // be tested more thoroughly in older browsers.
        $('#puzzle_state_editor_overlay')
            .css('width', '100%')
            .css('height', '100%');

        if (this.activeCell != null) {
            var $inputBox = this.$el.find('.edit_value');
            var $cell = this.$el.find('.cell_' + this.activeCell.x + '_' + this.activeCell.y);
            var $cellValue = $cell.find('.cell_value');
            this.positionEditBox($inputBox, $cellValue);
        }
    },

    cancelClicked: function() {
        $.modal.close();
    },

    cellClicked: function(x, y) {
        this.activeCell = {
            'x': x,
            'y': y
        };
        this.render();
    },

    deactivateCell: function($cell, $inputBox) {
        $inputBox.remove();
        $cell.removeClass('active');
        this.activeCell = null;
    },

    isActiveCell: function(x, y) {
        return (this.activeCell != null
             && this.activeCell.x == x
             && this.activeCell.y == y);
    },

    positionEditBox: function($inputBox, $cellValue) {

        var offset = $cellValue.offset()
        $inputBox.css('left', offset.left + 2);
        $inputBox.css('top', offset.top - 1);
        $inputBox.css('display', 'inline-block');
    },

    renderCellValue: function(x, y, $cellValue) {
        var tile = this.localModel.getTile(x, y);
        if (tile == 0) {
            tile = '\u2012';
        }
        $cellValue.html(tile);
    },

    renderActiveCell: function($cell, $cellValue, x, y) {

        // Make the cell active
        $cell.addClass('active');

        // Create an input box
        var $inputBox = $('<input type="text">');
        this.$el.append($inputBox);
        $inputBox.addClass('edit_value');
        $inputBox.val('');

        // Position the input box over the cell value
        this.positionEditBox($inputBox, $cellValue);

        // Handle keypresses in the input box
        $inputBox.keypress(_.bind(function(eventObject) {

            // Disable edit mode
            this.deactivateCell($cell, $inputBox);

            // Validate user input. If the key press was for a number
            // then the model should be updated. Otherwise, the key press
            // should be ignored.
            var asciiMinus = 45;
            var ascii0 = 48;
            var ascii8 = 56;
            if (eventObject.which >= ascii0 && eventObject.which <= ascii8) {
                this.localModel.setTile(x, y, eventObject.which - ascii0);
            } else if (eventObject.which == asciiMinus) {
                this.localModel.setTile(x, y, 0);
            }

            // Re-render the grid
            this.render();

            // Suppress the default behaviour of the input box
            eventObject.preventDefault();

        }, this));

        // Set up an event handler for when the input box loses focus. The
        // input box should be destroyed immediately, and the active cell
        // should be reset.
        $inputBox.blur(_.bind(function() {
            this.deactivateCell($cell, $inputBox);
            this.renderCellValue(x, y, $cellValue);
        }, this));

        // Clear the cell value, and focus on the input box
        $cellValue.html('&nbsp;');
        $inputBox.focus();
    },

    render: function() {

        // Update each tile independently
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {

                var $cell = this.$el.find('.cell.cell_' + x + '_' + y);
                var $cellValue = $cell.find('.cell_value');

                if (this.isActiveCell(x, y)) {
                    // If the cell has just been made active, then we should
                    // make it appear active and begin flashing the caret.
                    // While active, the visible cell value will be an
                    // empty space.
                    if (!$cell.hasClass('active')) {
                        this.renderActiveCell($cell, $cellValue, x, y);
                    }
                } else {
                    this.renderCellValue(x, y, $cellValue);
                }
            }
        }
    },

    saveClicked: function() {
        this.model.copyFrom(this.localModel);
        $.modal.close();
    }

});