/* global THREE:false */

'use strict';


export const parseNumericArray = function (string) {
  return string.trim().substr(1, string.length - 2).split(',').map(function (element) {
    return parseFloat(element);
  });
};


export const parseVector = function (string) {
  var array = parseNumericArray(string);
  return new THREE.Vector3(array[0], array[1], array[2]);
};


export const parseQuaternion = function (string) {
  var array = parseNumericArray(string);
  return new THREE.Quaternion(array[1], array[2], array[3], array[0]);
};


export const parseGeometry = function (string) {
  let match = null;

  match = string.match(/Cube{ w=(-?\d+(?:\.\d+)?), h=(-?\d+(?:\.\d+)?), d=(-?\d+(?:\.\d+)?) }/);
  if (match) {
    let width = parseFloat(match[1]),
        height = parseFloat(match[2]),
        depth = parseFloat(match[3]);

    return new THREE.BoxGeometry(width, height, depth);
  }

  throw 'Unable to parse shape from string: "' + string + '"';
};


// TODO test this
export const deepCopy = function (obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    if (obj.constructor) {
      function F() { }
      F.prototype = obj.constructor.prototype;

      copy = new F();
    }

    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = deepCopy(obj[attr]);
      }
    }

    return copy;
  }

  throw new Error('Unable to copy obj! Its type isn\'t supported.');
};


// TODO test this
export const construct = function (klass, args) {
  function F() {
    return klass.apply(this, args);
  }
  F.prototype = klass.prototype;

  return new F();
};
