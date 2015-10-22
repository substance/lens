'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

var ToggleBibItemCitationCommand = AnnotationCommand.extend({

  // When there's no existing annotation overlapping, we create a new one.
  canCreate: function(annos) {
    return annos.length === 0;
  },

  canDelete: function() {
    return false;
  },

  getAnnotationData: function() {
    return {
      target: []
    };
  }
});

module.exports = ToggleBibItemCitationCommand;