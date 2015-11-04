'use strict';
var path = require('path');
var assert = require('assert');
var postcssDarlecPlugin = require('../lib/postcss-plugin.js');
var lessFixtures = require('./_helper').lessFixtures;
var sassFixtures = require('./_helper').sassFixtures;
var readTestFileSync = require('./_helper').readTestFileSync;
var parseTestFileSync = require('./_helper').parseTestFileSync;
var postcss = require('postcss');

describe('postcss-darlec', function () {

    it('should warn about invalid declaration properties', function () {
      var css = sassFixtures();
      var result = postcssDarlecPlugin.process(css);
      assert.equal(result.messages.length, 2);
      assert.equal(result.messages[0].text, 'Forbidden declaration background');
      assert.equal(result.messages[1].text, 'Forbidden declaration color');
    });

});