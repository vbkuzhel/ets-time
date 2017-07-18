'use strict';
const fs = require('fs');
const path = require('path');
const { waterfall, concat } = require('async');
const { isArray, compact } = require('lodash');
const { getAnnotationObject, parseSwagger, parsePostman } = require('./lib/Parser');
const swaggerUi = require('swagger-ui-express');

const parseFile = (file, cb) => {
  fs.readFile(file, { encoding: 'utf8' }, (err, content) => {
    if (err) cb(err);
    let parsed = content.match(/\/\*(\*(?!\/)|[^*])*\*\//g);
    if (!isArray(parsed) || parsed.length === 0) {
      return cb();
    }
    try {
      let filteredContent = parsed.filter(item => /@[A-z0-9_]+/.test(item)).map(item => getAnnotationObject(item));
      cb(null, filteredContent);
    } catch (e) {
      cb(e);
    }
  });
};

const Init = (controllers_dir, swagger_spec, type = 'swagger', callback) => {
  waterfall(
    [
      cb => fs.readdir(controllers_dir, { encoding: 'utf8' }, cb),
      (files, cb) => {
        let fullFiles = files.map(file => path.resolve(controllers_dir, file));
        concat(fullFiles, parseFile, cb);
      },
      (annotations, cb) => {
        cb(null, compact(annotations));
      }
    ],
    (err, annotations) => {
      const spec_content = require(swagger_spec);
      switch (type) {
        case 'swagger':
          callback(err, parseSwagger(spec_content, annotations));
          break;
        case 'postman':
          callback(err, parsePostman(spec_content, annotations));
          break;
      }
    }
  );
};

module.exports = (app, root_dir, dir) => {
  const swagger_spec = path.join(root_dir, 'swagger.spec.js');
  const controllers_dir = path.join(root_dir, dir);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup('/swagger.json'));
  app.use('/:type(swagger|postman).json', (req, res, next) => {
    Init(controllers_dir, swagger_spec, req.params.type, (err, json_object) => {
      if (err) return next(err);
      res.json(json_object);
    });
  });
};
