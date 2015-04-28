'use strict';

(function (window) {
  window.context = describe;

  // polyfill for Function.prototype.bind, for some reason PhantomJS doesn’t
  // like bind...
  if (typeof Function.prototype.bind !== 'function') {
    Function.prototype.bind = function bind(obj) {
      var args = Array.prototype.slice.call(arguments, 1),
          self = this,
          NOP = function () { },
          bound = function () {
            return self.apply(
              this instanceof NOP ? this : (obj || {}),
              args.concat(Array.prototype.slice.call(arguments))
            );
          };
      NOP.prototype = this.prototype || {};
      bound.prototype = new NOP();
      return bound;
    };
  }
}).call(this, window);
