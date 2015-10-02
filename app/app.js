'use strict';

// i18n
require('./i18n/load');

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;

var Backend = require("./backend");
var NotificationService = require("./notification_service");
var CrossrefSearch = require('../lib/article/bib/crossref_search');
var ScienceWriter = require("../src/science_writer");

function App() {
  Component.Root.apply(this, arguments);

  this.backend = new Backend();
  this.notifications = new NotificationService();

  this.childContext = {
    backend: this.backend,
    notifications: this.notifications,
    bibSearchEngines: [new CrossrefSearch()],
  };
}

App.Prototype = function() {

  this.render = function() {
    var el = $$('div').addClass('app');
    if (this.state.doc) {
      el.append($$(ScienceWriter, {doc: this.state.doc}).ref('writer'))
    }
    return el;
  };

  this.didMount = function() {
    this.backend.getDocument('sample', function(err, doc) {
      this.setState({
        doc: doc
      });
    }.bind(this));
  };


};

OO.inherit(App, Component);

$(function() {
  Component.mount($$(App), $('#container'));
});
