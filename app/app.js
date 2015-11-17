'use strict';

var oo = require('substance/util/oo');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Backend = require("./backend");
var $ = require('substance/util/jquery');
var LensWriter = require('../LensWriter');
var LensReader = require('../LensReader');
var Router = require('substance/ui/Router');

function App() {
  Component.apply(this, arguments);

  this.backend = new Backend();
}

App.Prototype = function() {

  this.getInitialContext = function() {
    return {
      router: new Router(this)
    };
  };

  this.getInitialState = function() {
    return {
      mode: 'write'
    };
  };

  this.openReader = function() {
    this.extendState({
      mode: 'read'
    });
  };

  this.openWriter = function() {
    this.extendState({
      mode: 'write'
    });
  };

  this.render = function() {
    var el = $$('div').addClass('app');

    el.append(
      $$('div').addClass('menu').append(
        $$('button')
          .addClass(this.state.mode ==='write' ? 'active': '')
          .on('click', this.openWriter)
          .append('Write'),
        $$('button')
          .addClass(this.state.mode ==='read' ? 'active': '')
          .on('click', this.openReader)
          .append('Read')
      )
    );

    if (this.doc) {
      var lensEl;
      if (this.state.mode === 'write') {
        lensEl = $$(LensWriter, {
          doc: this.doc,
          onUploadFile: function(file, cb) {
            console.log('custom file upload handler in action...');
            var fileUrl = window.URL.createObjectURL(file);
            cb(null, fileUrl);
          },
          onSave: function(doc, changes, cb) {
            console.log('custom save handler in action...', doc.toXml());
            cb(null);
          }
        }).ref('writer').route();
      } else {
        lensEl = $$(LensReader, {
          doc: this.doc
        }).ref('reader').route();
      }
      el.append($$('div').addClass('context').append(lensEl));
    }
    return el;
  };

  this.didMount = function() {
    this.backend.getDocument('sample', function(err, doc) {
      this.doc = doc;
      this.rerender();
    }.bind(this));
  };
};

oo.inherit(App, Component);

$(function() {
  window.app = Component.mount($$(App), $('#container'));
});
