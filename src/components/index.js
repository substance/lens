'use strict';

var _ = require('substance/helpers');
var nodes = require('./nodes');
var panels = require('./panels');

module.exports = _.extend({
  "content_toolbar": require('./content_toolbar'),
  "content_editor": require('./content_editor')
}, nodes, panels);
