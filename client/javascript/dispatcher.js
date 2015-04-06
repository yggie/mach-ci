'use strict';

var callbacks = {};

export default class Dispatcher {
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


  static dispatch(eventName) {
    var args = Array.prototype.splice.call(arguments, 1, arguments.length);
    (callbacks[eventName] || []).forEach(function (callback) {
      callback.apply(null, args);
    });
  }


  static flush() {
    // do nothing for now
  }


  static clearAllListeners() {
    callbacks = {};
  }
}
