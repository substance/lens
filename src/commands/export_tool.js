var Substance = require('substance');
var Tool = Substance.Surface.Tool;


function slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to   = "aaaaeeeeiiiioooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}



var ExportTool = Tool.extend({

  name: "export",

  didInitialize: function() {
    this.state.disabled = false;
  },

  // Needs app context in order to request a state switch
  performAction: function(app) {
    var doc = this.context.doc;

    // Starts a download of the current HTML
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([doc.toXml()], {type: 'text/xml'}));
    a.download = slug(doc.getTitle())+".xml";

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }
});

module.exports = ExportTool;
