'use strict';

var _ = require('substance/util/helpers');
var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var Panel = require('substance/ui/Panel');
var Icon = require("substance/ui/FontAwesomeIcon");
var SmartReferenceItem = require("./SmartReferenceItem")
var uuid = require('substance/util/uuid');

var $$ = Component.$$;

function SmartReferencesPanel() {
  Panel.apply(this, arguments);
  this._initialize(this.props);
}

SmartReferencesPanel.Prototype = function() {

  this.render = function() {

    var items = this.props.data.message.items.map(function (result) {
      return $$(SmartReferenceItem, {
        node: result,
        handleSelection: this.handleSelection.bind(this)
      })
    }.bind(this))

    return $$('div').addClass("panel dialog cite-panel-component").append(
      $$('div').addClass("dialog-header").append(
        $$('a').addClass('back').attr('href', '#')
          .on('click', this.handleCancel)
          .append($$(Icon, {icon: 'fa-chevron-left'})),
        $$('div').addClass('label').append(this.i18n.t("choose_referenced_items"))
      ),
      $$('div').addClass("panel-content").ref('panelContent').append(
        $$('div').addClass("bib-items").append(
          items
        )
      )
    );
  };

  this.willReceiveProps = function(nextProps) {
    // this._initialize(nextProps);
  };

  this._initialize = function() {
    // this.items = this.getItems(this.props.citationType);
  };

  this.dispose = function() {
    this.$el.off('click', '.back', this.handleCancel);
  };

  this.didMount = function() {
    // var citationTargetId = this.getFirstCitationTarget();
    // if (citationTargetId) {
    //   this.scrollToNode(citationTargetId);
    // }
  };

  this.getFirstCitationTarget = function() {
    // var doc = this.props.doc;
    // var citation = doc.get(this.props.citationId);
    // return citation.targets[0];
  };

  // Determines wheter an item is active
  this.isItemActive = function(itemId) {
    // if (!this.props.citationId) return false;
    // var doc = this.props.doc;
    // var citation = doc.get(this.props.citationId);
    // return _.includes(citation.targets, itemId);
  };

  this.handleCancel = function(e) {
    e.preventDefault();
    this.send("switchContext", "toc");
  };

  this.getItems = function(citationType) {
    // var doc = this.props.doc;
    // var collection = doc.getCollection(citationType);
    // return collection.getItems();
  };

  // Called with a new bibliography entry
  this.handleSelection = function(bib) {
    var bibId = uuid('bib')
    var doc = this.props.doc
    var op = this.props.op

    // Get the correct Citeproc format
    fetch('http://api.crossref.org/works/' + bib.DOI + '/transform/application/vnd.citationstyles.csl+json')
    .then(function (response) {
      return response.json()
    }).then(function (data) {
      doc.transaction({}, {}, function(tx, args) {
        var bibItem = {
          id: bibId,
          type: "bib-item",
          source: JSON.stringify(data),
          format: 'citeproc'
        };
        tx.create(bibItem);

        tx.create({
          id: uuid('bib'),
          'type': 'bib-item-citation',
          'targets': [bibItem.id],
          'path': op.path,
          'startOffset': op.diff.pos + 1,
          'endOffset': op.diff.pos + 1,
        })
      })
    })

    // doc.transaction({}, {}, function (tx) {
    // })


    // doc.transaction({}, {}, function(tx) {
    //   var bibItem = {
    //     id: uuid('bib'),
    //     type: "bib-item",
    //     source: JSON.stringify(bibEntry.data),
    //     format: 'citeproc'
    //   };
    //   tx.create(bibItem);
    // });

    // var citationId = this.props.citationId;
    // var doc = this.props.doc;
    // var citation = doc.get(citationId);
    // var newTargets = citation.targets.slice();
    // if (_.includes(newTargets, targetId)) {
    //   newTargets = _.without(newTargets, targetId);
    // } else {
    //   newTargets.push(targetId);
    // }

    // var ctrl = this.context.controller;
    // ctrl.transaction(function(tx, args) {
    //   tx.set([citation.id, "targets"], newTargets);
    //   return args;
    // });
    // this.rerender();
  };
};

oo.inherit(SmartReferencesPanel, Panel);

// Panel configuration
// ----------------

SmartReferencesPanel.icon = "fa-bullseye";

// No context switch toggle is shown
SmartReferencesPanel.isDialog = true;

module.exports = SmartReferencesPanel;
