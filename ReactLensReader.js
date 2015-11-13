var React = require('react');
var LensReader = require('./LensReader');
var Article = require('./model/LensArticle');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

// LensReader wrapped in a React component
// ------------------

var ReactLensReader = React.createClass({

  getReader: function() {
    return this.reader;
  },

  getContent: function() {
    return this.reader.getDocument().toXml();
  },

  // New props arrived, update the editor
  componentDidUpdate: function() {
    var doc = this.createDoc(this.props.content);
    this.reader.extendProps({
      doc: doc
    });
  },

  createDoc: function(content) {
    return Article.fromXml(content || Article.XML_TEMPLATE);
  },

  componentDidMount: function() {
    var el = React.findDOMNode(this);
    var doc = this.createDoc(this.props.content);
    this.reader = Component.mount($$(LensReader, {
      doc: doc
    }), el);
  },

  componentWillUnmount: function() {
    this.reader.dispose();
  },

  render: function() {
    return React.DOM.div({
      className: 'lens-reader-wrapper'
    });
  }
});

ReactLensReader.propTypes = {
  content: React.PropTypes.string // XML source of the document
};

module.exports = ReactLensReader;