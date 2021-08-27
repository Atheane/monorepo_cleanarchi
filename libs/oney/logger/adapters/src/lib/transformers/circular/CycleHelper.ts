import * as _ from 'lodash';

// ref: https://github.com/douglascrockford/JSON-js/blob/ad6079cbd8dc362a3cc42e1f97c01aa5ccd48bfe/cycle.js
export class CycleHelper {
  // Make a deep copy of an object or array, assuring that there is at most
  // one instance of each object or array in the resulting structure. The
  // duplicate references (which might be forming cycles) are replaced with
  // an object of the form
  //      {$ref: PATH}

  // where the PATH is a JSONPath string that locates the first occurrence.
  // So,
  //      var a = [];
  //      a[0] = a;
  //      return JSON.decycle(a);
  // produces the string [{"$ref":"$"}].

  // JSONPath is used to locate the unique object. $ indicates the top level of
  // the object or array. [NUMBER] or [STRING] indicates a child member or
  // property.
  static decycle(obj: any) {
    const seenObjectsWithPath = new WeakMap<any, string>();

    const ensureAlreadyEncountered = obj => {
      // If the value is an object or array, look to see if we have already
      // encountered it. If so, return a $ref/path object.
      const path = seenObjectsWithPath.get(obj);
      if (path) {
        return { $ref: path };
      }
    };

    // The process recurses through the object, producing the deep copy.
    const process = (value, path) => {
      if (!value) return;

      if (Array.isArray(value)) {
        // If it is an array, replicate the array.
        const result = ensureAlreadyEncountered(value);
        if (result) {
          return result;
        }

        // Otherwise, accumulate the unique value and its path.
        seenObjectsWithPath.set(value, path);

        const clone = [];

        for (const i in value) {
          clone[i] = process(value[i], path + '[' + i + ']');
        }

        return clone;
      } else if (this.isObject(value)) {
        // If it is an object, replicate the object.
        const result = ensureAlreadyEncountered(value);
        if (result) {
          return result;
        }

        // Otherwise, accumulate the unique value and its path.
        seenObjectsWithPath.set(value, path);

        const clone = {};

        for (const key in value) {
          if (key in value) {
            clone[key] = process(value[key], path + '[' + JSON.stringify(key) + ']');
          }
        }

        return clone;
      } else {
        return value;
      }
    };

    return process(obj, '$');
  }

  // Restore an object that was reduced by decycle. Members whose values are
  // objects of the form
  //      {$ref: PATH}
  // are replaced with references to the value found by the PATH. This will
  // restore cycles. The object will be mutated.

  // The eval function is used to locate the values described by a PATH. The
  // root object is kept in a $ variable. A regular expression is used to
  // assure that the PATH is extremely well formed. The regexp contains nested
  // * quantifiers. That has been known to have extremely bad performance
  // problems on some browsers for very long strings. A PATH is expected to be
  // reasonably short. A PATH is allowed to belong to a very restricted subset of
  // Goessner's JSONPath.

  // So,
  //      var s = '[{"$ref":"$"}]';
  //      return JSON.retrocycle(JSON.parse(s));
  // produces an array containing a single element which is the array itself.
  static retrocycle(obj: any) {
    const $ = _.cloneDeep(obj);

    // The process function walks recursively through the object looking for $ref
    // properties. When it finds one that has a value that is a path, then it
    // replaces the $ref object with a reference to the value that is found by
    // the path.
    const process = value => {
      const restore = getSet => {
        const item = getSet.get();
        if (this.isObject(item)) {
          const path = item.$ref;
          if (this.isPath(path)) {
            getSet.set(eval(path));
          } else {
            process(item);
          }
        }
      };

      if (Array.isArray(value) || this.isObject(value)) {
        for (const key in value) {
          const ref = {
            get: () => value[key],
            set: x => (value[key] = x),
          };

          restore(ref);
        }
      }
    };

    process($);

    return $;
  }

  // eslint-disable-next-line no-control-regex
  private static _pathRegex = /^\$(?:\[(?:\d?|"(?:[^\\"\u0000-\u001f]|\\([\\"/bfnrt]|u[0-9a-zA-Z]{4}))*")])*$/;
  private static isPath(path: any) {
    return typeof path === 'string' && this._pathRegex.test(path);
  }

  private static isObject(x: any) {
    return typeof x === 'object' ? x !== null : typeof x === 'function';
  }
}
