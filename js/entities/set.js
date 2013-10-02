define([
  'app',
  'backbone'
], function(app, Backbone) {

  var Entities = app.module('Entities');

  Entities.Set = Backbone.RelationalModel.extend({
  });

  Entities.Sets = Backbone.Collection.extend({
    model: Entities.Set,

    initialize: function(models, options) {
      this.exercise = options.exercise;
    }
  });

  var API = {
    getSets: function() {
      return new Entities.Sets([
        new Entities.Set({ reps: 5, weight: 225 }),
        new Entities.Set({ reps: 5, weight: 235 }),
        new Entities.Set({ reps: 5, weight: 245 }),
        new Entities.Set({ reps: 5, weight: 255 })
      ]);
    }
  };

  app.reqres.setHandler('set:entities', function() {
    return API.getSets();
  });

  return Entities;

});
