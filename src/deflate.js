// @flow

const isPlainObject = (object: Object) => {
  if (typeof object === 'object' && object !== null) {
    return Object.prototype.toString.call(object) === '[object Object]';
  }

  return false;
};

// eslint-disable-next-line complexity
const deflate = (node: Object, index: Object, path: $ReadOnlyArray<string>) => {
  if (node && node.id && node.__typename) {
    const route = path.join(',');

    if (index[route] && index[route][node.__typename] && index[route][node.__typename][node.id]) {
      return {
        // eslint-disable-next-line id-match
        __typename: node.__typename,
        id: node.id
      };
    } else {
      if (!index[route]) {
        index[route] = {};
      }

      if (!index[route][node.__typename]) {
        index[route][node.__typename] = {};
      }

      index[route][node.__typename][node.id] = true;
    }
  }

  if (!isPlainObject(node)) {
    return node;
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

        return deflate(childNode, index, path.concat([fieldName]));
      });
    } else if (typeof value === 'object' && value !== null) {
      result[fieldName] = deflate(value, index, path.concat([fieldName]));
    } else {
      result[fieldName] = value;
    }
  }

  return result;
};

export default (response: Object) => {
  const index = {};

  return deflate(response, index, []);
};
