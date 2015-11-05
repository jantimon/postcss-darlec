'use strict';
var PostCssHelper = require('../lib/post-css-helper.js');
var postcssPlugin = require('./postcss-plugin.js');
var fs = require('fs');
var path = require('path');
var postcss = require('postcss');
var pathSorter = require('path-sort')

// Default logger
var defaultLogger = function(level, message) {
  console[level](message);
};

/**
 * Lint a given file
 * @param filename path to the file
 * @param [sourcemap] path to the sourceMap
 * @param [opts] Options
 * 
 * @returns postCss Result
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

/**
 * Sort messages and forward them to the logger
 * @param result postCss result
 * @param [logger] optional logger
 */
module.exports.outputWarnings = function(result, logger) {
  var warnings = module.exports.getLintWarnings(result);
  logger = logger || defaultLogger;
  // Sort warnings by files
  var fileWarnings = {};
  warnings.forEach(function(message) {
    var location = PostCssHelper.getRuleSourceLocation(message.node);
    var fileWarningArray = fileWarnings[location.filePath] = fileWarnings[location.filePath] || [];
    fileWarningArray.push({
      line: location.line,
      column: location.column,
      description: message.text
    });
  });
  // Sort files
  var sortedFileNames = pathSorter(Object.keys(fileWarnings));
  // Output
  sortedFileNames.forEach(function(filename) {
    logger('log', filename + ' ' + fileWarnings[filename].length + ' warnings:');
    fileWarnings[filename].forEach(function(warning){
      logger('warn', ' ' + warning.line + ':' + warning.column + ' - ' + warning.description);
    })
  });
  logger('log', warnings.length + ' warnings.');
  return warnings.length === 0;
};

/**
 * Lint a given file and output all warnings
 *
 * @param filename path to the file
 * @param [sourcemap] path to the sourceMap
 * @param [opts] Options
 * @param [logger] A logger
 * 
 * @returns postCss Result
 */
module.exports.lintFile = function(filename, sourceMap, opts, logger) {
  var lintResult = module.exports.processFile(filename, sourceMap, opts);
  return module.exports.outputWarnings(lintResult, logger);
};

module.exports.plugin = postcssPlugin;