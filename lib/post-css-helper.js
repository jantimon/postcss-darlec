'use strict';

var PostCssHelper = {};
var path = require('path');
module.exports = PostCssHelper;

/**
 * Extracts the filename of the rule from the source map if available
 *
 * @param rule
 * @returns {*}
 */
PostCssHelper.getFileName = function(rule) {
  return PostCssHelper.getRuleSourceLocation(rule).filePath;
};


PostCssHelper.getRuleSourceLocation = function(rule) {
  var filePath = rule.source.input.file;
  var line = rule.source.start.line;
  var column = rule.source.start.column;
  // Try to lookup file, line and column from sourcemap
  if (rule.source.input.map) {
    var consumer = rule.source.input.map.consumerCache;
    var originalPosition = consumer.originalPositionFor(rule.source.start);
    filePath = originalPosition.source;
    line = originalPosition.line;
    column = originalPosition.column;
  }
  // Get the absolute filename
  if (typeof filePath === 'string' && !path.isAbsolute(filePath)) {
    filePath = path.resolve(path.dirname(rule.source.input.file), filePath);
  }
  return {
    filePath: filePath,
    line: line,
    column: column
  };
};