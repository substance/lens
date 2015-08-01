'use strict';

var Component = require('substance/ui/component');
var SubstanceWriter = require("substance-ui/writer");
var $$ = Component.$$;

var tools = require('./tools');
var components = require('./components');
var stateHandlers = require('./state_handlers');

/**
 * ScienceWriter Component
 */
class ScienceWriter extends Component {

  constructor(parent, props) {
    super(parent, props);
  }

  render() {
    if (this.props.doc) {
      return $$(SubstanceWriter, {
        key: "writer",
        config: {
          components: components,
          tools: tools,
          stateHandlers: stateHandlers,
        },
        doc: this.state.doc,
        contentContainer: 'main'
      });
    } else {
      return $$('div', {}, "Loading...");
    }
  }
}

module.exports = ScienceWriter;
