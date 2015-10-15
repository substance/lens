# Lens Writer

Lens Writer is an attempt to build a full-featured scientific writer that is easily customizable and can be integrated into publishing workflows. In short: Lens Writer offers you everything you need to produce an article like [this one](http://lens.elifesciences.org/05098/#figures)

# Install

Clone the repository.

```bash
$ git clone https://github.com/substance/science-writer.git
```

Navigate to the source directory.

```bash
$ cd science-writer
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

Lens Writer provides a simple React wrapper, for easier embedding.

```js
var LensWriter = require('lens-writer/react');

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