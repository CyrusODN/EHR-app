#!/usr/bin/env node
'use strict';

const path = require('path');
const loadConfig = require('@react-native-community/cli-config').default;

const projectRoot = path.resolve(__dirname, '..');

function isValidRNDependency(config) {
  return (
    Object.keys(config.platforms).filter((key) => Boolean(config.platforms[key]))
      .length !== 0
  );
}

function filterConfig(config) {
  const dependencies = {};
  Object.keys(config.dependencies).forEach((item) => {
    if (isValidRNDependency(config.dependencies[item])) {
      dependencies[item] = config.dependencies[item];
    }
  });
  return {...config, dependencies};
}

console.log(JSON.stringify(filterConfig(loadConfig({projectRoot}))));
