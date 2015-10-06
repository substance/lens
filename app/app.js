'use strict';

var Substance = require('substance');
var OO = Substance.OO;
var Component = Substance.Component;
var $$ = Component.$$;
var Backend = require("./backend");

var ScienceWriter = require("../src");

function App() {
  Component.Root.apply(this, arguments);
  this.backend = new Backend();
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
