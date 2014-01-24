define([
  'app',
  'backbone',
  'bootstrap'
], function(app, Backbone, bootstrap) {

  var Entities = app.module('Entities');

  Entities.User = Backbone.Model.extend({
    urlRoot: '/auth/user/'
  });

  var API = {
    getCurrentUser: function(options) {
      var deferred = $.Deferred();

      options = options || { };
      if (!options.force && bootstrap.user) {
        // Load from bootstrap if exists
        deferred.resolve(new Entities.User(bootstrap.user));
      } else {
        new Entities.User().fetch({
          success: function(data) {
            if (res) {
              deferred.resolve(data);
            } else {
              deferred.resolve(undefined);
            }
          },
          error: function(data) {
            deferred.resolve(undefined);
          }
        });
      }

      return deferred.promise();
    }
  };

  app.reqres.setHandler('user:current', function() {
    return API.getCurrentUser();
  });

  return Entities;

});
