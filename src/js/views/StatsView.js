
StatsView = Backbone.View.extend({

    initialize: function() {
        this.model.on('change:statistics', this.render, this);
    },

    render: function() {
        var statsData = this.model.getStatistics();
        var html = '';
        for (var i = 0; i < statsData.length; i++) {
            var dataUnit = statsData[i];
            if (dataUnit.hasOwnProperty('value')) {
                html += '<span>' + dataUnit.name + ': ' + dataUnit.value + '</span>';
            } else {
                html += '<span>' + dataUnit.name + '</span>';
            }
        }

        this.$el.html(html);
    },

});