'use strict';
var path = require('path');
var fs = require('fs');
var postcss = require('postcss');

/**
 * Returns the sass render result object for the test/fixtures/main.scc
 */
function sassFixtures() {
  var nodeSass = require('node-sass');
  var filePath = path.join(__dirname, 'fixtures', 'scss');
  var mainFile = filePath + '/main.scss';
  var result = nodeSass.renderSync({
    file: mainFile,
    imagePath: '',
    includePaths: [ filePath ],
    omitSourceMapUrl: false,
    indentedSyntax: false,
    outputStyle: 'nested',
    precision: 5,
    sourceComments: false,
    sourceMapEmbed: true,
    sourceMapContents: false,
    sourceMap: mainFile + '.map'
  });
  return postcss.parse(result.css, {from: mainFile});
}

function parseTestFileSync(filename) {
  var postcss = require('postcss');
  return postcss.parse(fs.readFileSync(path.join(__dirname, filename), 'utf-8'), {
    from: path.resolve(path.join(__dirname, filename))
  });
}

module.exports = {
  sassFixtures: sassFixtures,
  parseTestFileSync: parseTestFileSync
};