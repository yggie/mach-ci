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

  match = string.match(/Cuboid{ w=(-?\d+(?:\.\d+)?), h=(-?\d+(?:\.\d+)?), d=(-?\d+(?:\.\d+)?) }/);
  if (match) {
    let width = parseFloat(match[1]),
        height = parseFloat(match[2]),
        depth = parseFloat(match[3]);

    return new THREE.BoxGeometry(width, height, depth);
  }

  throw 'Unable to parse shape from string: "' + string + '"';
};
