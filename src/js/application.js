$(function() {

    var enableDebug = false;

    // Set up the default configuration
    var configuration = new Configuration();
    configuration.getInitialState().setTiles([0,2,3,1,4,5,8,7,6]);
    configuration.getGoalState().setTiles([1,2,3,8,0,4,7,6,5]);

    // Initialise the application state with the default configuration
    var applicationState = new ApplicationState({
        'configuration': configuration
    });

    // Initialise the application view
    var applicationView = new ApplicationView({
        $controlPanel : $('#control_panel'),
        $statsView: $('#stats_view'),
        $treeView : $('#tree_view'),
        debug: enableDebug,
        model: applicationState
    });
});
