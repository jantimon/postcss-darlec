'use strict';
var postcss = require('postcss');
var minimatch = require('minimatch');
var path = require('path');
var PostCssHelper = require('./post-css-helper.js');
var readConfig = require('./read-config.js');


/**
 * The main processor function
 */
function linter(opts, css, result) {
  css.walkDecls(function (decl) {
    var fileName = PostCssHelper.getFileName(decl);
    // Read relative options file
    var fileOptions = opts ? opts : opts = readConfig(fileName);
    // Use relative file names for filter
    if (fileOptions.cwd) {
      fileName = path.relative(fileOptions.cwd, fileName);
    }
    if (shouldFileBeLinted(fileName, fileOptions)) {
      if(!isDeclarationAllowed(decl, fileOptions)) {
        decl.warn(result, 'Forbidden declaration ' + decl.prop);
      }
    }
  });
}

/**
 * Checks the opts wether the given file should be linted
 */
function shouldFileBeLinted(filename, opts) {
  if (!opts.filter) {
    return true;
  }
  for (var i = 0; i < opts.filter.length; i++) {
    if (minimatch(filename, opts.filter[i])) {
      return true;
    }
  }
  return false;
}

function isDeclarationAllowed(decl, opts) {
  if (Array.isArray(opts.forbiddenDeclarations) && opts.allowedDeclarations.indexOf(decl.prop) >= 0) {
    return false;
  }
  if (Array.isArray(opts.allowedDeclarations)) {
    return opts.allowedDeclarations.indexOf(decl.prop) >= 0;
  }
  return true;
}


/**
 * post css plugin interface
 */
var postcssLint = module.exports = postcss.plugin('postcss-lint', function (opts) {
    opts = opts;
    return linter.bind(this, opts);
});