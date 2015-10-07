'use strict';

var Substance = require('substance');
var _ = Substance._;
var OO = Substance.OO;
var Component = Substance.Component;
var Icon = require("substance/ui/font_awesome_icon");
var $$ = Component.$$;

function CitePanel() {
  Component.apply(this, arguments);
  this._initialize(props);
}

CitePanel.Prototype = function() {

  this.render = function() {
    var componentRegistry = this.context.componentRegistry;
    var items;
    if (this.items.length > 0) {
      items = this.items.map(function(item) {
        var comp = componentRegistry.get("_cite_" + this.props.citationType);
        return $$(comp).key(item.id).addProps({
          node: item,
          active: this.isItemActive(item.id),
          handleSelection: this.handleSelection.bind(this)
        });
      }.bind(this));
    } else {
      items = [$$('div').addClass("no-results").append("Nothing to reference.")];
    }
    return $$('div').addClass("panel dialog cite-panel-component").append(
      $$('div').addClass("dialog-header").append(
        $$('a').addClass('back').attr('href', '#')
          .on('click', this.handleCancel)
          .append($$(Icon).addProps({icon: 'fa-chevron-left'})),
        $$('div').addClass('label').append(this.i18n.t("choose_referenced_items"))
      ),
      $$('div').addClass("panel-content").append(
        $$('div').addClass("bib-items").append(
          items
        )
      )
    );
  };

  this.willReceiveProps = function(nextProps) {
    console.log('CitePanel.willReceiveProps', nextProps);
    this._initialize(nextProps);
  };

  this._initialize = function() {
    this.items = this.getItems(this.props.citationType);
  };

  this.dispose = function() {
    this.$el.off('click', '.back', this.handleCancel);
  };

  // Determines wheter an item is active
  this.isItemActive = function(itemId) {
    if (!this.props.citationId) return false;
    var doc = this.props.doc;
    var citation = doc.get(this.props.citationId);
    return _.includes(citation.targets, itemId);
  };

  this.handleCancel = function(e) {
    e.preventDefault();
    this.send("switchContext", "toc");
  };

  this.getItems = function(citationType) {
    var doc = this.props.doc;
    var collection = doc.getCollection(citationType);
    return collection.getItems();
  };

  // Called with entityId when an entity has been clicked
  this.handleSelection = function(targetId) {
    var citationId = this.props.citationId;
    var doc = this.props.doc;
    var citation = doc.get(citationId);
    var newTargets = citation.targets.slice();
    if (_.includes(newTargets, targetId)) {
      newTargets = _.without(newTargets, targetId);
    } else {
      newTargets.push(targetId);
    }

    var ctrl = this.context.controller;
    ctrl.transaction(function(tx, args) {
      tx.set([citation.id, "targets"], newTargets);
      return args;
    });
    this.rerender();
  };
};

OO.inherit(CitePanel, Component);

// Panel configuration
// ----------------

CitePanel.icon = "fa-bullseye";

// No context switch toggle is shown
CitePanel.isDialog = true;

module.exports = CitePanel;
