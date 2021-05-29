window.onload = function () {
  // Set up the default configuration
  const configuration = new Configuration();
  configuration.getInitialState().setTiles([0, 2, 3, 1, 4, 5, 8, 7, 6]);
  configuration.getGoalState().setTiles([1, 2, 3, 8, 0, 4, 7, 6, 5]);

  // Initialise the application view
  new Vue({
    el: document.getElementById('app'),
    data: {
      model: new ApplicationState({
        'configuration': configuration
      })
    },
    template: `
        <application-view :model="model"></application-view>
      `
  });
};
