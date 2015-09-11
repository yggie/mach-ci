'use strict';

// polyfill for Function.prototype.bind, for some reason PhantomJS doesn’t
// like bind...
if (typeof Function.prototype.bind !== 'function') {
  Function.prototype.bind = function bind(obj) { // eslint-disable-line no-extend-native
    var args = Array.prototype.slice.call(arguments, 1),
        self = this,
        NOP = function () { },
        bound = function () {
          return self.apply(
            this instanceof NOP ? this : (obj || {}), // eslint-disable-line no-invalid-this
            args.concat(Array.prototype.slice.call(arguments))
          );
        };
    NOP.prototype = this.prototype || {};
    bound.prototype = new NOP();
    return bound;
  };
}
