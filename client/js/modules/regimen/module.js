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
      'regimen/:id': 'showRegimen',
      'regimen/:id/week/:week': 'showRegimen'
    }
  });

  var API = {
    showRegimen: function(regimenId, week) {
      var requestRegimen = app.request('regimen:entity', regimenId);
      $.when(requestRegimen).done(function(regimen) {
        var layout = new Regimen.Show.Layout();
        app.mainRegion.show(layout);

        if (week && !isNaN(week = parseInt(week, 10))) {
          regimen.set('week', week);
        }

        layout.iterateRegion.show(new Regimen.Show.IterateView({
          model: regimen
        }));

        layout.workoutsRegion.show(new Workout.List.WorkoutCollectionView({
          collection: regimen.get('program').get('workouts')
        }));
      });
    }
  };

  Regimen.addInitializer(function() {
    var router = new Regimen.Router({
      controller: API
    });

    app.vent.on('change:week', function(regimen) {
      var id = regimen.get('id'),
        week = regimen.get('week');

      router.navigate('regimen/' + id + '/week/' + week);
    });
  });

  return Regimen;

});
