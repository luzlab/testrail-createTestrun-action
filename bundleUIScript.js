const pJson = require('./package.json');
const { readFileSync, writeFileSync, readdirSync } = require('fs');
const { join } = require('path');
const mkdirp = require('mkdirp');

const testRailHeader = `
name: Github PR Check Button for Testruns
description: Adds a button to testrun to push a PR Check to Github. The button sends summary statistics to Github.
author: Carlo Quinonez
version: ${pJson.version}
includes: ^runs/view
excludes:

js:`;

const rollupOutputPath = readdirSync('build').pop();
const uiscriptJSCode = readFileSync(
  join(__dirname, 'build', rollupOutputPath),
  'utf8',
);
mkdirp('dist');
writeFileSync('dist/uiscript',`${testRailHeader}\n${uiscriptJSCode}`)
