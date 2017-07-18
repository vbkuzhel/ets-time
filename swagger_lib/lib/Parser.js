const { each, filter, assign, groupBy } = require('lodash');

module.exports = {
  getAnnotationObject: content => {
    return getAttribute(content);
  },
  parsePostman: (swagger_spec, object) => {
    return object;
  },
  parseSwagger: (swagger_spec, object) => {
    console.log(object);
    let paths = groupBy(object, 'route');
    each(paths, (elements, key) => {
      each(elements, (v, k) => {
        elements[v.method] = {};
      });
      //console.log(key, '->', element);
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
      result = Object.assign(result, { [parsedLine[1]]: parseParams(parsedLine[2]) });
    }
  });
  return Object.keys(result).length ? result : null;
};

const parseParams = line => {
  let arrayPattern = new RegExp(/^[a-z,_]+$/, 'gi');
  if (arrayPattern.test(line)) {
    line = line.split(',');
  }
  return line;
};
