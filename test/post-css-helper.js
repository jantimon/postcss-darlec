'use strict';
var assert = require('assert');
var path = require('path');
var postcss = require('postcss');
var postCssHelper = require('../lib/post-css-helper');
var parseTestFileSync = require('./_helper').parseTestFileSync;


describe('post-css-helper', function () {

  describe('getFileName', function() {
    it('should return undefined if no source map is present', function () {
      var root = postcss.parse('body { background: blue }');
      assert.equal(postCssHelper.getFileName(root.nodes[0]), undefined);
    });

    it('should return the correct filename from a css file', function () {
      var filename = 'fixtures/css/test1/test.css';
      var root = parseTestFileSync(filename);
      assert.equal(postCssHelper.getFileName(root.nodes[0]), path.resolve(__dirname, filename));
    });
  });

});