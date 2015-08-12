'use strict';

var _ = require('substance/helpers');
var Writer = require("substance/ui/writer");

var tools = require('./tools');
var components = require('./components');
var stateHandlers = require('./state_handlers');

class ScienceWriter extends Writer {

  constructor(parent, params) {
    params.props.config = {
      containerId: 'main',
      components: components,
      tools: tools,
      stateHandlers: stateHandlers
    }
    super(parent, params);
  }

}

module.exports = ScienceWriter;
