'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Backend = require("./backend");
var DocumentSession = require('substance/model/DocumentSession');
var $ = window.$ = require('substance/util/jquery');
var LensWriter = require('../LensWriter');
var LensReader = require('../LensReader');
var Router = require('substance/ui/Router');
var LensArticleExporter = require('../model/LensArticleExporter');
var exporter = new LensArticleExporter();

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

    if (this.documentSession) {
      var lensEl;
      if (this.state.mode === 'write') {
        lensEl = $$(LensWriter, {
          documentSession: this.documentSession,
          onUploadFile: function(file, cb) {
            console.log('custom file upload handler in action...');
            var fileUrl = window.URL.createObjectURL(file);
            cb(null, fileUrl);
          },
          onSave: function(doc, changes, cb) {
            var xml = exporter.exportDocument(doc);
            console.log('XML', xml);
            cb(null);
          }
        }).ref('writer').route();
      } else {
        lensEl = $$(LensReader, {
          documentSession: this.documentSession
        }).ref('reader').route();
      }
      el.append($$('div').addClass('context').append(lensEl));
    }
    return el;
  };

  this.didMount = function() {
    this.backend.getDocument('sample', function(err, doc) {
      this.documentSession = new DocumentSession(doc);
      // Expose to window for debugging
      window.documentSession = this.documentSession;
      this.rerender();
    }.bind(this));
  };
};

Component.extend(App);

$(function() {
  window.app = Component.mount(App, $('#container'));
});
