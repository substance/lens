# Lens (editable edition)

This a rewrite of [Lens](http://github.com/elifesciences/lens) by [Substance](http://substance.io). It comes with a Writer component for web-based authoring and a new Reader component for displaying.

*Important note: This project is at an experimental state. It is also not compatible with JATS/NLM at this stage, as it reads a simplified custom XML format. We will add support for JATS import + export at a later time.*

# Install

Clone the repository.

```bash
$ git clone https://github.com/substance/lens.git
```

Navigate to the source directory.

```bash
$ cd lens
```

Install via npm

```bash
$ npm install
```

Start the dev server

```bash
$ npm run start
```

And navigate to [http://localhost:5000](http://localhost:5000)

# Usage from React

Lens provides simple React wrappers, for easier embedding. To embed the Writer do:

```js
var LensWriter = require('lens/ReactLensWriter');

React.createElement(LensWriter, {
  content: LENS_ARTICLE_XML,
  onSave: function(xml, cb) {
    // Save document and confirm with cb(null, )
  },
  onFileUpload(file, cb) {
    // Handle file upload
    // Store file somewhere and confirm with cb(null, 'http://url.to/file.png')
  }
});
```

And for the Reader:

```js
var LensReader = require('lens/ReactLensReader');

React.createElement(LensReader, {
  content: LENS_ARTICLE_XML
});
```