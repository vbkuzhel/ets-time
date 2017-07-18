const { each, filter, assign, groupBy, map, ke } = require('lodash');

module.exports = {
  getAnnotationObject: content => {
    return getAttribute(content);
  },
  parsePostman: (swagger_spec, object) => {
    return object;
  },
  parseSwagger: (swagger_spec, object) => {
    let { _extra: { responses: extra_responses, parameters: extra_parameters } } = swagger_spec;

    let paths = {};
    let annotations = groupBy(object, 'route');
    each(annotations, (elements, route) => {
      paths[route] = {};
      let parameters = [];
      each(elements, attr => {
        let {
          tags,
          summary,
          description: desc,
          method,
          operationId: oid,
          consumes = ['application/json'],
          produces = ['application/json'],
          responses: modifiedResponses,
          headers: modifiedHeaders,
          body: modifiedBody
        } = attr;

        method = method.toString().toLowerCase();

        // modify responses
        let responses = {};
        each(modifiedResponses, item => {
          responses[item.replace(/[^\d]+/, '')] = extra_responses[item];
        });
        each(modifiedHeaders, item => {
          parameters.push(extra_parameters[item]);
        });
        each(modifiedBody, item => {
          parameters.push(extra_parameters[item]);
        });

        paths[route][method] = assign(
          {},
          { tags },
          { summary },
          { desc },
          { oid },
          { consumes },
          { produces },
          { parameters },
          { responses }
        );
      });
    });

    swagger_spec = assign(swagger_spec, { paths: paths });

    return swagger_spec;
  }
};

const getAttribute = line => {
  let lines = line.split('\n');
  let result = {};

  let filteredLines = filter(lines, line => /@[a-z_]/g.test(line));

  each(filteredLines, line => {
    let regex = new RegExp(/@([a-z_]+)\s+(.*)$/, 'gi');
    let parsedLine = regex.exec(line);
    if (parsedLine) {
      result = Object.assign(result, { [parsedLine[1]]: parseParams(parsedLine[1], parsedLine[2]) });
    }
  });
  return Object.keys(result).length ? result : null;
};

const parseParams = (attr, value) => {
  switch (attr) {
    case 'query':
    case 'body':
    case 'tags':
    case 'headers':
    case 'consumes':
    case 'responses':
      value = value.split(',');
      break;
  }

  return value;
};
