import Dispatcher from '../client/javascript/dispatcher';

describe('Dispatcher', function () {
  'use strict';

  it('can dispatch events', function (done) {
    Dispatcher.on('example', done);
    Dispatcher.dispatch('example');
  });


  it('can dispatch events with arguments', function (done) {
    Dispatcher.on('example', function (arg1, arg2) {
      expect(arg1).to.be.true;
      expect(arg2).to.be.empty;
      done();
    });
    Dispatcher.dispatch('example', true, []);
  });


  it('can unregister from listening to further event dispatches', function () {
    let numCalled = 0,
        unregister = Dispatcher.on('example', function () {
          numCalled++;
        });

    Dispatcher.dispatch('example');
    unregister.call();
    Dispatcher.dispatch('example');

    Dispatcher.flush();
    expect(numCalled).to.equal(1);
  });


  afterEach(function () {
    Dispatcher.clearAllListeners();
  });
});
