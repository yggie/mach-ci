'use strict';

import Dispatcher from './dispatcher';

function construct(klass, args) {
  function F() {
    return klass.apply(this, args);
  }
  F.prototype = klass.prototype;

  return new F();
}


function clone(obj) {
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
      copy[i] = clone(obj[i]);
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
        copy[attr] = clone(obj[attr]);
      }
    }

    return copy;
  }

  throw new Error('Unable to copy obj! Its type isn\'t supported.');
}


var cache = {},
    globalId = 0;


export default class Store {
  static create(klass, ...args) {
    let instance = construct(klass, args);

    this.register(instance);
    Dispatcher.dispatch(this.eventName('create', klass), instance);

    return clone(instance);
  }


  static update(instance) {
    cache[instance.$id] = clone(instance);
    Dispatcher.dispatch(this.eventName('update', instance), instance);
  }


  static get(id) {
    return cache[id];
  }


  static onCreate(klass, callback) {
    if (!this.isRegistered(klass)) {
      throw 'Attempted to listen to events from an unregistered class! [' + klass.toString() + ']';
    }

    return Dispatcher.on(this.eventName('create', klass), callback);
  }


  static onUpdate(instance, callback) {
    return Dispatcher.on(this.eventName('update', instance), callback);
  }


  static executeAndRegisterOnUpdate(instance, callback) {
    callback.call(null, instance);
    return this.onUpdate(instance, callback);
  }


  static register(object) {
    object.$id = globalId++;
    cache[object.$id] = object;

    return object.$id;
  }


  static isRegistered(object) {
    return typeof object.$id !== 'undefined';
  }


  static eventName(eventType, object) {
    return eventType + ':' + object.$id;
  }
}
