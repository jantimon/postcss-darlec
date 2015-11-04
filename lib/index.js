'use strict';
var PostCssHelper = require('../lib/post-css-helper.js');
var postcssPlugin = require('./postcss-plugin.js');
var fs = require('fs');
var path = require('path');
var postcss = require('postcss');

// Default logger
var defaultLogger = function(level, message) {
  console[level](message);
};

/**
 * Lint a given file
 */
module.exports.processFile = function(filename, sourceMap, opts) {
  if(!opts) {
    opts = sourceMap || null;
    sourceMap = undefined;
  }
  if (!sourceMap && fs.existsSync(filename + '.map')) {
    sourceMap = filename + '.map';
  }
  sourceMap = fs.existsSync(sourceMap) ? fs.readFileSync(sourceMap, 'utf-8') : undefined;
  var css = postcss.parse(fs.readFileSync(filename, 'utf-8'), {
    from: path.resolve(filename),
    map: sourceMap
  });
  return postcssPlugin.process(css, opts);
};

module.exports.getLintWarnings = function(result) {
  return result.messages.filter(function(message) {
    return message.plugin === 'postcss-lint' && message.type === 'warning';
  });
};

module.exports.outputWarnings = function(result, logger) {
  var warnings = module.exports.getLintWarnings(result);
  logger = logger || defaultLogger;
  warnings.forEach(function(message) {
    var location = PostCssHelper.getRuleSourceLocation(message.node);
    logger('warn', location.filePath + ':' + location.line + ':' + location.column + ' ' + message.text);
  });
  logger('log', warnings.length + ' warnings.');
  return !!result.warnings.length;
};

module.exports.lintFile = function(filename, sourceMap, opts) {
  var lintResult = module.exports.processFile(filename, sourceMap, opts);
  return module.exports.outputWarnings(lintResult);
};

module.exports.plugin = postcssPlugin;