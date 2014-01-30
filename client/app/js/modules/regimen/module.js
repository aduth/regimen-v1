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
      // Request regimen at week if specified
      week = parseInt(week, 10);
      if (isNaN(week)) week = undefined;

      // Request regimen from server
      var requestRegimen = app.request('regimen:entity', regimenId, week);
      $.when(requestRegimen).done(function(regimen) {
        app.vent.trigger('change:week', regimen);

        var layout = new Regimen.Show.Layout();
        app.mainRegion.show(layout);

        layout.iterateRegion.show(new Regimen.Show.IterateView({
          model: regimen
        }));

        layout.workoutsRegion.show(new Workout.List.WorkoutCollectionView({
          collection: regimen.get('program').get('workouts')
        }));
      });

      // Update user last regimen
      var requestUser = app.request('user:change:lastRegimen', regimenId);

      return requestRegimen;
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

  app.reqres.setHandler('regimen:show', function(regimenId, week) {
    app.vent.trigger('regimen:show', regimenId, week);
    return API.showRegimen(regimenId, week);
  });

  return Regimen;

});
