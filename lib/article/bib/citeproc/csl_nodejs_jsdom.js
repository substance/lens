// just a shim which imports our jquery based xml adapter.

var XmlAdapter;
if (typeof window === 'undefined') {
	XmlAdapter = require('./csl_jquery');
} else {
	XmlAdapter = require('./xmldom');
}

module.exports = {
	CSL_NODEJS_JSDOM: XmlAdapter
};
