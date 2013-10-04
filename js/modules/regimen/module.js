define([
  'marionette',
  'app',
  'modules/workout/list/view',
  'entities/regimen',
  'entities/workout',
  'modules/regimen/show/view'
], function(Marionette, app, Workout) {

  var Regimen = app.module('Regimen');

  Regimen.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'regimen/:id': 'showRegimen'
    }
  });

  var API = {
    showRegimen: function(regimenId) {
      var requestRegimen = app.request('regimen:entity', regimenId);
      $.when(requestRegimen).done(function(regimen) {
        var layout = new Regimen.Show.Layout();

        layout.on('show', function() {
          layout.iterateRegion.show(new Regimen.Show.IterateView({
            model: regimen
          }));

          layout.workoutsRegion.show(new Workout.List.WorkoutCollectionView({
            collection: regimen.get('program').get('workouts')
          }));
        });

        app.mainRegion.show(layout);
      });
    }
  };

  Regimen.addInitializer(function() {
    new Regimen.Router({
      controller: API
    });
  });

  return Regimen;

});
