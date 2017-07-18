const { each, filter, assign, groupBy } = require('lodash');

module.exports = {
  getAnnotationObject: content => {
    return getAttribute(content);
  },
  parsePostman: (swagger_spec, object) => {
    return object;
  },
  parseSwagger: (swagger_spec, object) => {
    //console.log(object);
    let paths = {};
    let annotations = groupBy(object, 'route');
    each(annotations, (elements, route) => {
      paths[route] = {};
      each(elements, attr => {
        paths[route][attr.method.toString().toLowerCase()] = {};
      });
    });

    console.log(paths);

    return swagger_spec;
  }
};

const getAttribute = line => {
  let lines = line.split('\n');
  let result = {};

  let filteredLines = filter(lines, line => /@[a-z_]/g.test(line));

  each(filteredLines, line => {
    let regex = new RegExp(/@([a-z_]+)\s+(.*)$/, 'g');
    let parsedLine = regex.exec(line);
    if (parsedLine) {
      result = Object.assign(result, { [parsedLine[1]]: parseParams(parsedLine[1], parsedLine[2]) });
    }
  });
  return Object.keys(result).length ? result : null;
};

const parseParams = (attr, value) => {
  switch (attr) {
    case 'body':
    case 'headers':
    case 'responses':
      value = value.split(',');
      break;
  }

  return value;
};
