define([
  'app',
  'backbone',
  'handlebars'
], function(app, Backbone, handlebars) {

  var Entities = app.module('Entities');

  Entities.Set = Backbone.RelationalModel.extend({
    initialize: function() {
      this.on('change:exercise', this.updateVariables);
      this.on('change:weight', this.precompileWeightTemplate);
    },

    updateVariables: function() {
      var modelJSON = this.toJSON(),
        exercise = modelJSON.exercise,
        workout = this.set('workout', exercise.workout).get('workout'),
        program = this.set('program', workout.program).get('program'),
        regimen = this.set('regimen', program.regimen).get('regimen'),
        modelJSON = this.toJSON();

      var calculatedWeight = eval(this.weightTemplate(modelJSON));
      this.set('weight_calc', calculatedWeight);
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
