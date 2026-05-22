#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const cliIndex = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-native-community',
  'cli',
  'build',
  'index.js',
);

if (!fs.existsSync(cliIndex)) {
  process.exit(0);
}

let source = fs.readFileSync(cliIndex, 'utf8');
let changed = false;

if (source.includes("stdio: 'pipe'")) {
  source = source.replace("stdio: 'pipe'", "stdio: 'ignore'");
  changed = true;
}

const brokenExec = `_child_process().default.execFileSync(absolutePath, {
        stdio: 'ignore'
      });`;

const fixedExec = `_child_process().default.execFileSync('/bin/sh', [absolutePath], {
        stdio: 'ignore'
      });`;

if (source.includes(brokenExec)) {
  source = source.replace(brokenExec, fixedExec);
  changed = true;
}

if (changed) {
  fs.writeFileSync(cliIndex, source);
  console.log('Patched @react-native-community/cli setup_env hang');
}
