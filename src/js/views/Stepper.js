
// Define a view to manage the stepper controls
Stepper = Backbone.View.extend({

    events: {
        // Attach click handlers to the stepper buttons
        "click .start"  : "start",
        "click .back"   : "back",
        "click .next"   : "next",
        "click .pause"  : "pause",
        "click .reset"  : "reset",
        "click .resume" : "resume"
    },

    initialize: function() {
        this.model.on('change', this.render, this);
        this.model.getConfiguration().on('change', this.render, this);
        this.render();
    },

    render: function() {

        var $start = this.$el.find('input.start');
        var $back = this.$el.find('input.back');
        var $next = this.$el.find('input.next');
        var $pause = this.$el.find('input.pause');
        var $resume = this.$el.find('input.resume');
        var $reset = this.$el.find('input.reset');

        // Show 'resume' and 'pause' buttons if in burst mode
        var burstMode = (this.model.getConfiguration().getMode() == 'burst');
        $resume.toggleClass('invisible', !burstMode);
        $pause.toggleClass('invisible', !burstMode);
        $next.toggleClass('invisible', burstMode);
        $back.toggleClass('invisible', burstMode);

        switch (this.model.getState()) {

        case 'stopped':
            $start.removeAttr('disabled');
            $back.attr('disabled', true);
            $next.attr('disabled', true);
            $pause.attr('disabled', true);
            $resume.attr('disabled', true);
            $reset.attr('disabled', true);
            break;

        case 'running':
            $start.attr('disabled', true);
            $back.removeAttr('disabled');
            $next.removeAttr('disabled');
            $pause.removeAttr('disabled');
            $resume.attr('disabled', true);
            $reset.removeAttr('disabled');
            break;

        case 'paused':
            $start.attr('disabled', true);
            $back.attr('disabled', true);
            $next.attr('disabled', true);
            $pause.attr('disabled', true);
            $resume.removeAttr('disabled');
            $reset.removeAttr('disabled');
            break;

        case 'complete':
            $start.attr('disabled', true);
            $back.removeAttr('disabled');
            $next.attr('disabled', true);
            $pause.attr('disabled', true);
            $resume.attr('disabled', true);
            $reset.removeAttr('disabled');
            break;
        }

        if (this.model.getNumberOfUndoActions() == 0) {
            $back.attr('disabled', true);
        }

        // Disable the start button if the state is invalid
        if (!this.model.getConfiguration().isValid()) {
            $start.attr('disabled', true);
        }
    },

    back: function() {
        this.model.undo();
    },

    next: function() {
        this.model.next();
    },

    pause: function() {
        this.model.pause();
    },

    reset: function() {
        this.model.reset();
    },

    resume: function() {
        this.model.resume();
    },

    start: function() {
        this.model.start();
    }

});