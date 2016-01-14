'use strict';

var _ = require('substance/util/helpers');
var Component = require('substance/ui/Component');
var ScrollPane = require('substance/ui/ScrollPane');
var DialogHeader = require('substance/ui/DialogHeader');
var $$ = Component.$$;

function CitePanel() {
  Component.apply(this, arguments);

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

    return $$('div').addClass('sc-cite-panel').append(
      $$(DialogHeader, {label: this.i18n.t('choose_referenced_items')}),
      $$(ScrollPane).append(
        items
      ).ref('panelEl')
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
      this.refs.panelEl.scrollTo(citationTargetId);
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

Component.extend(CitePanel);

module.exports = CitePanel;
