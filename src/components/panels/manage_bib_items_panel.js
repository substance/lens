'use strict';

var Substance = require('substance');
var _ = Substance._;
var OO = Substance.OO;
var Component = Substance.Component;
var Icon = require("substance/ui/font_awesome_icon");
var $$ = Component.$$;

var ListBibItems = require('./list_bibitems_panel');
var AddBibItems = require('./add_bibitems_panel');

var CONTEXTS = [
  {contextId: 'list', label: 'Manage', icon: 'fa-list'},
  {contextId: 'add', label: 'Add references', icon: 'fa-plus'},
];

function ManageBibItemsPanel() {
  Component.apply(this, arguments);
}

ManageBibItemsPanel.Prototype = function() {

  this.getInitialState = function() {
    return {
      contextId: 'list',
      searchResult: {
        query: '',
        items: []
      }
    };
  };

  this.render = function() {
    var state = this.state;
    var navItems = _.map(CONTEXTS, function(context) {
      var button = $$('button').addClass('pill')
        .attr("data-id", context.contextId)
        .on('click', this.handleContextSwitch)
        .append($$(Icon).addProps({ icon: context.icon })
          .append(" "+context.label)
        );
      if (context.contextId === state.contextId) {
        button.addClass('active');
      }
      return button;
    }.bind(this));

    return $$('div').append(
      $$('div').addClass('header toolbar clearfix menubar fill-light').append(
        $$('div').addClass('title float-left large').append("References"),
        $$('div').addClass('menu-group small').append(navItems),
        $$('button').addClass('button close-modal float-right').append(
          $$(Icon).addProps({ icon: 'fa-close' })
        ).on('click', this.handleCloseModal)
      ),
      this.getContextElement()
    );
  };

  this.handleContextSwitch = function(e) {
    e.preventDefault();
    var contextId = e.currentTarget.dataset.id;
    this.setState({contextId: contextId});
  };

  this.getContextElement = function() {
    if (this.state.contextId === "list") {
      return $$(ListBibItems).addProps({
        doc: this.props.doc
      });
    } else {
      return $$(AddBibItems).addProps({
        doc: this.props.doc,
        searchResult: this.state.searchResult
      });
    }
  };
};

OO.inherit(ManageBibItemsPanel, Component);

// Panel Configuration
// -----------------

ManageBibItemsPanel.contextId = "manageBibItems";
ManageBibItemsPanel.icon = "fa-align-left";

module.exports = ManageBibItemsPanel;
