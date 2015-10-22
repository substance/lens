'use strict';

var Substance = require('substance');
// var _ = require('substance/basics/helpers');

var OO = Substance.OO;
var LensController = require('./lens_controller');
var components = require('./components');
var commands = require('./commands');

var ContextToggles = require('substance/ui/ContextToggles');
var ContentPanel = require("substance/ui/ContentPanel");
var StatusBar = require("substance/ui/StatusBar");

var ContentToolbar = require('./components/content_toolbar');
var Component = require('substance/ui/component');
var $$ = Component.$$;

function LensReader(parent, params) {
  LensController.call(this, parent, params);
}

LensReader.Prototype = function() {

  this.static = {
    config: {
      controller: {
        commands: commands.controller,
        components: components,
      },
      main: {
        commands: commands.main,
      },
      cover: {
        commands: commands.cover
      },
      panelOrder: ['toc'],
      containerId: 'main'      
    }
  };

  this.render = function() {
    var doc = this.props.doc;
    var config = this.getConfig();
    var el = $$('div').addClass('lc-reader sc-controller');

    // Basic 2-column layout
    // -------------

    el.append(
      $$('div').ref('workspace').addClass('le-workspace').append(
        // Main (left column)
        $$('div').ref('main').addClass("le-main").append(
          $$(ContentPanel, {
            doc: doc,
            containerId: config.containerId
          }).ref('content')
        ),
        // Resource (right column)
        $$('div').ref('resource')
          .addClass("le-resource")
          .append(
            $$(ContextToggles, {
              panelOrder: config.panelOrder,
              contextId: this.state.contextId
            }).ref("context-toggles"),
            this.renderContextPanel()
          )
      )
    );

    // Status bar
    el.append(
      $$(StatusBar, {doc: doc}).ref('statusBar')
    );
    return el;
  };

};

OO.inherit(LensReader, LensController);

module.exports = LensReader;
