'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var Writer = require("substance/ui/writer");

var tools = require('./tools');
var components = require('./components');
var stateHandlers = require('./state_handlers');

function ScienceWriter(parent, params) {
  params.props.config = {
    containerId: 'main',
    components: components,
    tools: tools,
    stateHandlers: stateHandlers
  };
  Writer.call(this, parent, params);
}

OO.inherit(ScienceWriter, Writer);

module.exports = ScienceWriter;
