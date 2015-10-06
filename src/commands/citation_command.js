'use strict';

var AnnotationCommand = require('substance/ui/commands/toggle_annotation');

var ToggleBibItemCitationCommand = AnnotationCommand.extend({

  // When there's no existing annotation overlapping, we create a new one.
  canCreate: function(annos) {
    return annos.length === 0;
  },

  // executeCreate: function() {
  //   return {
  //     mode: 'create'
  //   };
  // },

  getAnnotationData: function() {
    return {
      target: []
    };
  },

  canDelete: function() {
    return false;
  }
});

module.exports = ToggleBibItemCitationCommand;