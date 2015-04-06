'use strict';

import { deepCopy, construct } from './utils';
import Dispatcher from './dispatcher';

var cache = {},
    globalId = 0;


export default class Store {
  static create(klass, ...args) {
    let instance = construct(klass, args);

    this.register(instance);
    Dispatcher.dispatch(this.eventName('create', klass), instance);

    return deepCopy(instance);
  }


  static update(instance) {
    // TODO create deep copies at the dispatch level?
    cache[instance.$id] = deepCopy(instance);
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
