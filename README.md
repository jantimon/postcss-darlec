# postcss-darlec

[![Build Status](https://travis-ci.org/jantimon/postcss-darlec.svg)](https://travis-ci.org/jantimon/postcss-darlec)
[![NPM version](https://badge.fury.io/js/postcss-darlec.svg)](http://badge.fury.io/js/postcss-darlec)
[![Coverage Status](https://coveralls.io/repos/jantimon/postcss-darlec/badge.png)](https://coveralls.io/r/jantimon/postcss-darlec)
[![Dependency Status](https://david-dm.org/jantimon/postcss-darlec.png)](https://david-dm.org/jantimon/postcss-darlec)

**allow/disallow specific css properties**

Usage: `postcss-darlec [options] <css-file> [<source-map>]`

Iterates through all files and looks for a .css-darlec file in the source files directory or its parent directories.
The [.css-darlec file](https://github.com/jantimon/postcss-darlec/tree/master/test/fixtures/.cssdarlec) limits the usage of the css properties

## Tests

[![Build Status](https://secure.travis-ci.org/jantimon/html-tpl-loader.svg?branch=master)](http://travis-ci.org/jantimon/html-tpl-loader)
[![Coverage Status](https://coveralls.io/repos/jantimon/postcss-darlec/badge.png)](https://coveralls.io/r/jantimon/postcss-darlec)

Run unit tests:

```
  npm install
  npm test
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)


