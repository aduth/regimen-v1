define([
  'app',
  'backbone',
  'handlebars'
], function(app, Backbone, handlebars) {

  var Entities = app.module('Entities');

  Entities.Set = Backbone.RelationalModel.extend({
    initialize: function() {
      this.on('change:weight', this.precompileWeightTemplate);
    },

    updateVariables: function() {
      var model = this.toJSON();
      model.workout = model.exercise.workout;
      model.program = model.workout.program;
      model.regimen = model.program.regimen;

      var template = this.weightTemplate(model);
      if (Worker && Blob) {
        var eval = 'postMessage(eval(' + template + '))',
          blog = new Blob([ eval ], { type: 'application/javascript' }),
          worker = new Worker(URL.createObjectURL(blog));

        worker.onmessage = function(e) {
          this.set('weight_calc', e.data);
          worker.terminate();
        }.bind(this);
      } else {
        var calculatedWeight = eval(template);
        this.set('weight_calc', calculatedWeight);
      }
    },

    precompileWeightTemplate: function() {
      var weightTemplateText = this.get('weight');
      this.weightTemplate = handlebars.compile(weightTemplateText);
    }
  });

  Entities.Sets = Backbone.Collection.extend({
    model: Entities.Set,

    initialize: function(models, options) {
      this.exercise = options.exercise;
    }
  });

  return Entities;

});
