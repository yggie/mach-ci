import Dispatcher from '../client/javascript/dispatcher';

describe('Dispatcher', function () {
  'use strict';

  class Example { }
  class AnotherExample { }
  Dispatcher.register(Example);
  Dispatcher.register(AnotherExample);


  it('allows registering to listen for create events', function (done) {
    var example = new Example();
    Dispatcher.onCreate(Example, function (arg) {
      expect(arg).to.equal(example);
      done();
    });
    Dispatcher.notifyCreate(example);
  });


  it('allows registering to listen for update events', function (done) {
    var example = new Example();
    Dispatcher.notifyCreate(example);
    Dispatcher.onUpdate(example, function (arg) {
      expect(arg).to.equal(example);
      expect(arg.didUpdate).to.be.true;
      done();
    });
    example.didUpdate = true;
    Dispatcher.notifyUpdate(example);
  });


  it('allows immediate execution and registering to listen for update events', function () {
    var example = new Example(),
        counter = 0;

    Dispatcher.notifyCreate(example);
    Dispatcher.executeAndRegisterOnUpdate(example, function (arg) {
      expect(arg).to.equal(example);
      counter++;
    });
    Dispatcher.notifyUpdate(example);

    expect(counter).to.equal(2);
  });


  it('maintains a list of independent events for each instance', function (done) {
    var example1 = new Example(),
        example2 = new Example(),
        atLeastOne = false;

    Dispatcher.notifyCreate(example1);
    Dispatcher.onUpdate(example1, function (arg) {
      expect(arg).to.equal(example1);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });
    Dispatcher.notifyCreate(example2);
    Dispatcher.onUpdate(example2, function (arg) {
      expect(arg).to.equal(example2);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });

    Dispatcher.notifyUpdate(example1);
    Dispatcher.notifyUpdate(example2);
  });


  it('maintains a list of independent events for each class', function (done) {
    var example = new Example(),
        anotherExample = new AnotherExample(),
        atLeastOne = false;

    Dispatcher.onCreate(Example, function (arg) {
      expect(arg).to.equal(example);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });
    Dispatcher.onCreate(AnotherExample, function (arg) {
      expect(arg).to.equal(anotherExample);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });

    Dispatcher.notifyCreate(example);
    Dispatcher.notifyCreate(anotherExample);
  });


  it('allows unregistering from further events', function () {
    var example = new Example(),
        counter = 0;

    Dispatcher.notifyCreate(example);
    let unregister = Dispatcher.onUpdate(example, function () {
          if (counter++) {
            throw 'Called more than once!';
          }
        });

    Dispatcher.notifyUpdate(example);
    unregister.call();
    Dispatcher.notifyUpdate(example);
  });


  afterEach(function () {
    Dispatcher.clearAllListeners();
  });
});
