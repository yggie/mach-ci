/* global chai:false */

import Store from '../../client/javascript/store.js';

(function (chai) {
  'use strict';

  chai.use(function (chai) {
    chai.Assertion.addProperty('registered', function () {
      var instance = this._obj;

      this.assert(
        Store.isRegistered(instance),
        'Expected ' + instance.toString() + ' to be registered to the Store but was not',
        'Expected ' + instance.toString() + ' not to be registered to the Store but was',
        instance
      );
    });
  });
}).call(this, chai);
