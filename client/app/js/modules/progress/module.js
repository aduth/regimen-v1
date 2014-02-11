define([
  'marionette',
  'app'
], function(Marionette, app) {

  var Progress = app.module('Progress');

  Progress.data = { };

  var API = {
    getWeekProgress: function(regimenId, week) {
      var deferred = $.Deferred();

      if (regimenId in Progress.data && week in Progress.data[regimenId]) {
        return Progress.data[regimenId][week];
      }

      if (!(regimenId in Progress.data)) {
        Progress.data[regimenId] = { };
      }

      // Set progress data as deferred so as to allow multiple listeners if simultaneously requested
      Progress.data[regimenId][week] = app.request('progress:entities', regimenId, week);
      $.when(Progress.data[regimenId][week]).done(function(progresses) {
        Progress.data[regimenId][week] = progresses;
        deferred.resolve(progresses);
      });

      return deferred.promise();
    }
  };

  app.vent.on('change:week', function(regimen) {
    var regimenId = regimen.get('id'),
      week = regimen.get('week');

    Progress.regimenId = regimenId;
    Progress.week = week;

    API.getWeekProgress(regimenId, week);
  });

  app.reqres.setHandler('progress:current', function() {
    return API.getWeekProgress(Progress.regimenId, Progress.week);
  });

  return Progress;

});
