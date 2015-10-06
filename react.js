var React = require('react');

// Usage:
// var LensWriter = require('lens-writer/adapters/react');
// 
// React.createElement(LensWriter, {
//   content: LENS_ARTICLE_XML,
//   onSave: function(xml, cb) {
//     
//   }
// });

// Lens + Substance
var LensWriter = require('./src/lens_writer');
var Article = require('./lib/article');
var Component = require('substance/ui/component');
var $$ = Component.$$;

var ReactLensWriter = React.createClass({

  getWriter: function() {
    return this;
  },

  onSave: function(doc, changes, cb) {
    var xml = doc.toXml();
    this.props.onSave(xml, cb);
  },

  getContent: function() {
    return this.writer.getDocument().toXml();
  },

  // New props arrived, update the editor
  componentDidUpdate: function() {
    var doc = this.createDoc(this.props.content);
    this.writer.extendProps({
      doc: doc
    });
  },

  createDoc: function(content) {
    return Article.fromXml(content || Article.XML_TEMPLATE);
  },

  componentDidMount: function() {
    var el = React.findDOMNode(this);
    var doc = this.createDoc(this.props.content);
    this.writer = Component.mount($$(LensWriter, {
      doc: doc,
      onSave: this.onSave
    }), el);
  },

  render: function() {
    return React.DOM.div({
      className: 'lens-writer-wrapper'
    });
  }
});

ReactLensWriter.propTypes = {
  content: React.PropTypes.string // XML source of the document
};

module.exports = ReactLensWriter;