'use strict';

var callbacks = {},
    globalHandles = 1;

function eventNameFor(eventType, object) {
  if (!object.__handle__) {
    throw 'Object has not been registered on the application!';
  }
  return eventType + '-' + object.__handle__;
}

function createEventName(klass) {
  return eventNameFor('create', klass);
}

function updateEventName(instance) {
  return eventNameFor('update', instance);
}

export default class Store {
  static on(eventName, callback) {
    let callbackList = callbacks[eventName] = callbacks[eventName] || [];
    callbackList.push(callback);

    return function () {
      let callbackList = callbacks[eventName] || [],
          index = callbackList.indexOf(callback);

      if (index > -1) {
        callbackList.splice(index, 1);
      } else {
        console.log('Called unregister on a callback which no longer exists!');
      }
    };
  }

  static notify(eventName, args) {
    (callbacks[eventName] || []).forEach(function (callback) {
      callback.apply(null, args);
    });
  }

  static onCreate(klass, callback) {
    return this.on(createEventName(klass), callback);
  }

  static onUpdate(instance, callback) {
    return this.on(updateEventName(instance), callback);
  }

  static notifyCreate(instance) {
    this.register(instance);
    return this.notify(createEventName(instance.constructor), [instance]);
  }

  static notifyUpdate(instance) {
    return this.notify(updateEventName(instance), [instance]);
  }

  static register(object) {
    if (object.__handle__) {
      console.log('Object has already been registered to the store');
    } else {
      object.__handle__ = globalHandles++;
    }

    return object.__handle__;
  }

  static clearAllListeners() {
    callbacks = {};
  }
}
