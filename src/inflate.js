// @flow

// eslint-disable-next-line complexity
const inflate = (node: Object, index: Object, path: $ReadOnlyArray<string>) => {
  if (node && node.id && node.__typename) {
    const route = path.join(',');

    if (index[route] && index[route][node.__typename] && index[route][node.__typename][node.id]) {
      return index[route][node.__typename][node.id];
    }

    if (!index[route]) {
      index[route] = {};
    }

    if (!index[route][node.__typename]) {
      index[route][node.__typename] = {};
    }

    index[route][node.__typename][node.id] = node;
  }

  const fieldNames = Object.keys(node);

  const result = {};

  for (const fieldName of fieldNames) {
    const value = node[fieldName];

    if (Array.isArray(value)) {
      result[fieldName] = value.map((childNode) => {
        if (typeof childNode === 'string') {
          return childNode;
        }

        return inflate(childNode, index, path.concat([fieldName]));
      });
    } else if (typeof value === 'object' && value !== null) {
      result[fieldName] = inflate(value, index, path.concat([fieldName]));
    } else {
      result[fieldName] = value;
    }
  }

  return result;
};

export default (response: Object) => {
  const index = {};

  return inflate(response, index, []);
};
