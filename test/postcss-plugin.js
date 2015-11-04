'use strict';
var path = require('path');
var assert = require('assert');
var postcssDarlec = require('../');
var postcssDarlecPlugin = require('../lib/postcss-plugin.js');
var sassFixtures = require('./_helper').sassFixtures;
var postcss = require('postcss');
var noopLogger = function() {};

describe('postcss-darlec', function () {

    it('should warn about invalid declaration properties', function () {
      var css = sassFixtures();
      var result = postcssDarlecPlugin.process(css);
      assert.equal(result.messages.length, 2);
      assert.equal(result.messages[0].text, 'Forbidden declaration background');
      assert.equal(result.messages[1].text, 'Forbidden declaration color');
    });

    it('should return true if all tests passed', function () {
      var css = sassFixtures();
      var opts = {};
      var result = postcssDarlecPlugin.process(css, opts);
      var lintPassed = postcssDarlec.outputWarnings(result, noopLogger);
      assert.equal(lintPassed, true);
    });

    it('should return false if one ore more tests failed', function () {
      var css = sassFixtures();
      var result = postcssDarlecPlugin.process(css);
      var lintPassed = postcssDarlec.outputWarnings(result, noopLogger);
      assert.equal(lintPassed, false);
    });

    it('should lint a file without sourcemap', function () {
      var cssFileName = path.resolve(__dirname, 'fixtures/css/test1/test.css');
      var lintPassed = postcssDarlec.lintFile(cssFileName, undefined, undefined, noopLogger);
      assert.equal(lintPassed, false);
    });

});