'use strict';

var Component = require('substance/ui/component');
var SubstanceWriter = require("substance-ui/writer");
var $$ = Component.$$;

var tools = require('./tools');
var components = require('./components');
var stateHandlers = require('./state_handlers');

/**
 * ScienceWriter Component
 */
class ScienceWriter extends SubstanceWriter {

  constructor(parent, props) {
    super(parent, props, {
      contentContainer: 'main',
      components: components,
      tools: tools,
      stateHandlers: stateHandlers
    });
  }
}

module.exports = ScienceWriter;
