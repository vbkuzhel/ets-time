'use strict';
const fs = require('fs');
const path = require('path');
const { waterfall, concat } = require('async');
const { isArray, compact } = require('lodash');
const argv = require('minimist')(process.argv.slice(2));
const { getAnnotationObject } = require('./lib/Parser');

//const parseFile = (file, cb) => {
//  fs.readFile(path.join(argv.dir, file), { encoding: 'utf8' }, (err, content) => {
//    if (err) cb(err);
//
//    let parsed = content.match(/\/\*(\*(?!\/)|[^*])*\*\//g);
//    if (!isArray(parsed) || parsed.length === 0) {
//      return cb();
//    }
//    let filteredContent = parsed.filter(item => /@[A-z0-9_]+/.test(item)).map(item => getAnnotationObject(item));
//    cb(null, filteredContent);
//  });
//};
//
//waterfall(
//  [
//    cb => fs.readdir(argv.dir, { encoding: 'utf8' }, cb),
//    (files, cb) => {
//      // Parse each file, get annotations
//      concat(files, parseFile, cb);
//    },
//    (annotations, cb) => {
//      cb(null, compact(annotations));
//    }
//  ],
//  (err, result) => {
//    let swaggerObject = console.log(result);
//  }
//);

module.exports = (type_response = 'swagger', cb) => {
  return cb(null, { [type_response]: 'works fine' });
};

//fs.fs.readFile('./../app/controllers/auth.js', 'utf-8', (err, content) => {
//  let parsed = content.toString().match(/\/\*{2}([A-z\s\S0-9])+\*\//g)[0].split('\n');
//  console.log(parsed);
//});
