/* global chai:false */

import Dispatcher from '../../client/javascript/dispatcher';

(function (chai) {
  'use strict';

  chai.use(function (chai) {
    chai.Assertion.addProperty('registered', function () {
      var instance = this._obj;

      this.assert(
        Dispatcher.isRegistered(instance),
        'Expected ' + instance.toString() + ' to be registered to the Dispatcher but was not',
        'Expected ' + instance.toString() + ' not to be registered to the Dispatcher but was',
        instance
      );
    });
  });
}).call(this, chai);
