'use strict';

var _ = require('substance/util/helpers');
var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var Panel = require('substance/ui/Panel');
var Icon = require("substance/ui/FontAwesomeIcon");
var $$ = Component.$$;

function CitePanel() {
  Panel.apply(this, arguments);
  this._initialize(this.props);
}

CitePanel.Prototype = function() {

  this.render = function() {
    var componentRegistry = this.context.componentRegistry;
    var items;
    if (this.items.length > 0) {
      items = this.items.map(function(item) {
        var comp = componentRegistry.get(this.props.citationType+'-entry');
        return $$(comp, {
          node: item,
          active: this.isItemActive(item.id),
          handleSelection: this.handleSelection.bind(this)
        }).ref(item.id);
      }.bind(this));
    } else {
      items = [$$('div').addClass("no-results").append("Nothing to reference.")];
    }
    return $$('div').addClass('sc-panel sc-cite-panel sm-dialog').append(
      $$('div').addClass('se-dialog-header').append(
        $$('a').addClass('se-back').attr('href', '#')
          .on('click', this.handleCancel)
          .append($$(Icon, {icon: 'fa-chevron-left'})),
        $$('div').addClass('se-label').append(this.i18n.t('choose_referenced_items'))
      ),
      $$('div').addClass('se-panel-content').ref('panelContent').append(
        $$('div').addClass("se-bib-items se-panel-content-inner").append(
          items
        )
      )
    );
  };

  this.willReceiveProps = function(nextProps) {
    this._initialize(nextProps);
  };

  this._initialize = function() {
    this.items = this.getItems(this.props.citationType);
  };

  this.dispose = function() {
    this.$el.off('click', '.back', this.handleCancel);
  };

  this.didMount = function() {
    this._scrollToTarget();
  };

  this.didReceiveProps = function() {
    this._scrollToTarget();
  };

  this._scrollToTarget = function() {
    var citationTargetId = this.getFirstCitationTarget();
    if (citationTargetId) {
      this.scrollToNode(citationTargetId);
    }
  };

  this.getFirstCitationTarget = function() {
    var doc = this.props.doc;
    var citation = doc.get(this.props.citationId);
    if (citation) {
      return citation.targets[0];
    } else {
      return null;
    }
  };

  // Determines wheter an item is active
  this.isItemActive = function(itemId) {
    if (!this.props.citationId) return false;
    var doc = this.props.doc;
    var citation = doc.get(this.props.citationId);
    if (citation) {
      return _.includes(citation.targets, itemId);
    } else {
      return false;
    }
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

oo.inherit(CitePanel, Panel);

// Panel configuration
// ----------------

CitePanel.icon = "fa-bullseye";

// No context switch toggle is shown
// CitePanel.isDialog = true;

module.exports = CitePanel;
