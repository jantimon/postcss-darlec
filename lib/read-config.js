'use strict';
var cache = {};
var path = require('path');
var fs = require('fs');

/**
 * Recursive search up the file directories to find the closest .cssdarlec file
 */
function getClosestConfig(filepath) {
  // Add to cache
  if (cache[filepath] === undefined) {
    var configFile = path.join(filepath, '.cssdarlec');
    if (fs.existsSync(configFile)) {
      try {
        var config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        if (!config.cwd) {
          config.cwd = filepath;
        }
        cache[filepath] = config;
      } catch(e) {
        throw new Error('Could not parse ' + configFile + ': ' + e);
      }
    }
  }
  // Try to return from cache
  if (cache[filepath]) {
    return cache[filepath];
  }
  // Go up one parent
  var nextDir = path.dirname(filepath);
  if (filepath === nextDir) {
    throw new Error('Could not find any .cssdarlec file');
  }
  cache[filepath] = getClosestConfig(nextDir);
  return cache[filepath];
}

module.exports = function(filepath) {
  // get rid of the trailing filename
  if (path.extname(filepath) !== '') {
    filepath = path.dirname(filepath);
  }
  return getClosestConfig(filepath);
};