define([
  'marionette',
  'app'
], function(Marionette, app) {

  var Dashboard = app.module('Dashboard');

  Dashboard.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'dashboard/': 'showDashboard'
    }
  });

  var API = {
    showDashboard: function() {
      // [TODO][NYI]
      console.log('Show dashboard');
    }
  };

  Dashboard.addInitializer(function() {
    var router = new Dashboard.Router({
      controller: API
    });
  });

  app.reqres.setHandler('dashboard:show', function() {
    app.vent.trigger('dashboard:show');
    app.Router.navigate('dashboard/');
    return API.showDashboard();
  });

  return Dashboard;

});
