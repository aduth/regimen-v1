define([
  'marionette',
  'app',
  'modules/dashboard/show/view'
], function(Marionette, app, Dashboard) {

  var Dashboard = app.module('Dashboard');

  Dashboard.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'dashboard/': 'showDashboard'
    }
  });

  var API = {
    showDashboard: function() {
      var layout = new Dashboard.Show.Layout();
      app.mainRegion.show(layout);
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
