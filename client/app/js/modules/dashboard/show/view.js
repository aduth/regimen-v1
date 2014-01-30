define([
  'marionette',
  'app',
  'hbs!modules/dashboard/show/templates/layout'
], function(Marionette, app, tmplDashboardLayout) {

  var Dashboard = app.module('Dashboard');

  Dashboard.Show = { };

  Dashboard.Show.Layout = Marionette.Layout.extend({
    template: tmplDashboardLayout,

    className: 'container',

    ui: {
      createRegimen: '.create-regimen',
      resumeRegimen: '.resume-regimen'
    },

    events: {
      'click .create-regimen': 'createRegimen',
      'click .resume-regimen': 'resumeRegimen'
    },

    resumeRegimen: function() {
      app.request('regimen:show:lastRegimen');
    }
  });

  return Dashboard;

});
