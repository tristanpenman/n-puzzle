
// Define a view to manage the control panel DOM elements
ControlPanel = Backbone.View.extend({

    events: {
        'change .algorithm select': 'selectAlgorithm',
        'change .heuristic select': 'selectHeuristic',
        'change .mode select': 'selectMode',
        'click .initial input': 'editInitialState',
        'click .initial .puzzle_state_view': 'editInitialState',
        'click .goal input': 'editGoalState',
        'click .goal .puzzle_state_view': 'editGoalState'
    },

    createTooltip: function($target, content) {
        $target.qtip({
            'content': content,
            show: {
                when:'click',
                delay: 0,
                effect: {
                    length: 0
                }
            },
            hide: 'unfocus',
            position: {
                corner: {
                    target: 'rightMiddle',
                    tooltip: 'leftMiddle'
                }
            },
            style: {
                border: {
                     width: 1,
                     radius: 1,
                     color: '#666'
                },
                name: 'light',
                tip: {
                    corner: 'leftMiddle',
                    size: {
                        x: 6,
                        y: 11
                    }
                }
            }
        });
    },

    initialize: function() {

        this.createTooltip(
            this.$el.find('.algorithm img.help'),
            this.$el.find('.algorithm .tooltip_text').html()
        );

        this.createTooltip(
            this.$el.find('.heuristic img.help'),
            this.$el.find('.heuristic .tooltip_text').html()
        );

        // Bind the render method to be run in the context of a control
        // panel instance
        _.bindAll(this, 'render');

        // Attach a Stepper presenter to the stepper controls
        this.stepper = new Stepper({
            el: this.$el.find('.stepper'),
            model: this.model
        });

        // Create a subview for the initial state
        this.initialStateView = new PuzzleStateView({
            el: this.$el.find('.initial .puzzle_state_view'),
            model: this.model.getConfiguration().getInitialState()
        });

        // Create a subview for the goal state
        this.goalStateView = new PuzzleStateView({
            el: this.$el.find('.goal .puzzle_state_view'),
            model: this.model.getConfiguration().getGoalState()
        });

        // Populate the available settings
        this.populateAlgorithmsList(Configuration.getAvailableAlgorithms());
        this.populateHeuristicsList(Configuration.getAvailableHeuristics());
        this.populateControlModesList(Configuration.getAvailableControlModes());

        // Respond to changes in the application state
        this.model.on('change', this.render, this);

        // Respond to changes in the application configuration
        this.model.getConfiguration().on('change', this.render, this);

        // Render the initial application configuration
        this.render();
    },

    editGoalState: function() {
        if (this.model.isStopped()) {
            new PuzzleStateEditor({
                el: $('#puzzle_state_editor'),
                model: this.model.getConfiguration().getGoalState()
            });
        }
    },

    editInitialState: function() {
        if (this.model.isStopped()) {
            new PuzzleStateEditor({
                el: $('#puzzle_state_editor'),
                model: this.model.getConfiguration().getInitialState()
            });
        }
    },

    populateAlgorithmsList: function(availableAlgorithms) {
        this.algorithms = availableAlgorithms;
        var $algorithmList = this.$el.find('.algorithm select');
        for (var algorithm in this.algorithms) {
            $algorithmList.append($('<option value="' + algorithm + '">' + this.algorithms[algorithm].name + '</option>'));
        }
    },

    populateControlModesList: function(availableControlModes) {
        this.modes = availableControlModes;
        var $controlModesList = this.$el.find('.mode select');
        for (var mode in this.modes) {
            $controlModesList.append($('<option value="' + mode + '">' + this.modes[mode].name + '</option>'));
        }
    },

    populateHeuristicsList: function(availableHeuristics) {
        this.heuristics = availableHeuristics;
        var $heuristicsList = this.$el.find('.heuristic select');
        for (var heuristic in this.heuristics) {
            $heuristicsList.append($('<option value="' + heuristic + '">' + this.heuristics[heuristic].name + '</option>'));
        }
    },

    render: function() {

        // This view contains some declarative behaviour:
        // Elements that should be disabled while the algorithm is running
        // have the class 'disabled_while_running'. Conversely, elements
        // that should be enabled have the class 'enabled_while_running'.
        if (this.model.isStopped()) {

            // Enable groups with the 'disabled_while_running' class
            this.$el.find('.disabled_while_running select').removeAttr('disabled');
            this.$el.find('.disabled_while_running input').removeAttr('disabled');
            this.$el.find('.disabled_while_running.group').removeClass('disabled');

            // Disable groups with the 'enabled_while_running' class
            this.$el.find('.enabled_while_running.group select').attr('disabled', 'disabled');
            this.$el.find('.enabled_while_running.group input').attr('disabled', 'disabled');
            this.$el.find('.enabled_while_running.group').addClass('disabled');

            // Update configuration and available options
            this.syncConfiguration();

        } else {

            // Disable groups with the 'disabled_while_running' class
            this.$el.find('.disabled_while_running.group select').attr('disabled', 'disabled');
            this.$el.find('.disabled_while_running.group input').attr('disabled', 'disabled');
            this.$el.find('.disabled_while_running.group').addClass('disabled');

            // Enable groups with the 'enabled_while_running' class
            this.$el.find('.enabled_while_running.group select').removeAttr('disabled');
            this.$el.find('.enabled_while_running.group input').removeAttr('disabled');
            this.$el.find('.enabled_while_running.group').removeClass('disabled');
        }
    },

    selectAlgorithm: function() {
        var algorithm = this.$el.find('.algorithm select').val();
        this.model.getConfiguration().setAlgorithm(algorithm);
    },

    selectHeuristic: function() {
        var heuristic = this.$el.find('.heuristic select').val();
        this.model.getConfiguration().setHeuristic(heuristic);
    },

    selectMode: function() {
        var mode = this.$el.find('.mode select').val();
        this.model.getConfiguration().setMode(mode);
    },

    syncConfiguration: function() {

        var config = this.model.getConfiguration();

        // Update algorithm
        var $algorithmsList = this.$el.find('.algorithm select');
        var algorithm = config.getAlgorithm();
        $algorithmsList.val(algorithm);

        // Update heuristic
        //
        // Disables the heuristics list if a non-heuristic algorithm has been
        // selected. This adds a 'Not available' option to the list and
        // selects it to show that text to the user.
        //
        var $heuristicsList = this.$el.find('.heuristic select');
        if (this.algorithms[algorithm].usesHeuristic) {
            // Remove 'Not available' option
            $('.heuristic select [value="na"]').remove();
            // Enable list and select the current heuristic
            $heuristicsList.removeAttr('disabled');
            $heuristicsList.val(config.getHeuristic());
        } else {
            // Find or create the 'Not available' option
            if (this.$el.find('.heuristic select .na').length == 0) {
                $heuristicsList.append($('<option value="na">Not available</option>'));
            }
            // Disable list and select the 'Not available' option
            $heuristicsList.val('na');
            $heuristicsList.attr('disabled', true);
        }

        // Update control mode
        this.$el.find('.mode select').val(config.getMode());
    }

});