import Store from '../client/javascript/store';

describe('Store', function () {
  'use strict';

  class Example { }
  class AnotherExample { }
  Store.register(Example);
  Store.register(AnotherExample);


  it('allows registering to listen for create events', function (done) {
    var example = new Example();
    Store.onCreate(Example, function (arg) {
      expect(arg).to.equal(example);
      done();
    });
    Store.notifyCreate(example);
  });


  it('allows registering to listen for update events', function (done) {
    var example = new Example();
    Store.notifyCreate(example);
    Store.onUpdate(example, function (arg) {
      expect(arg).to.equal(example);
      expect(arg.didUpdate).to.be.true;
      done();
    });
    example.didUpdate = true;
    Store.notifyUpdate(example);
  });


  it('allows immediate execution and registering to listen for update events', function () {
    var example = new Example(),
        counter = 0;

    Store.notifyCreate(example);
    Store.executeAndRegisterOnUpdate(example, function (arg) {
      expect(arg).to.equal(example);
      counter++;
    });
    Store.notifyUpdate(example);

    expect(counter).to.equal(2);
  });


  it('maintains a list of independent events for each instance', function (done) {
    var example1 = new Example(),
        example2 = new Example(),
        atLeastOne = false;

    Store.notifyCreate(example1);
    Store.onUpdate(example1, function (arg) {
      expect(arg).to.equal(example1);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });
    Store.notifyCreate(example2);
    Store.onUpdate(example2, function (arg) {
      expect(arg).to.equal(example2);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });

    Store.notifyUpdate(example1);
    Store.notifyUpdate(example2);
  });


  it('maintains a list of independent events for each class', function (done) {
    var example = new Example(),
        anotherExample = new AnotherExample(),
        atLeastOne = false;

    Store.onCreate(Example, function (arg) {
      expect(arg).to.equal(example);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });
    Store.onCreate(AnotherExample, function (arg) {
      expect(arg).to.equal(anotherExample);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });

    Store.notifyCreate(example);
    Store.notifyCreate(anotherExample);
  });


  it('allows unregistering from further events', function () {
    var example = new Example(),
        counter = 0;

    Store.notifyCreate(example);
    let unregister = Store.onUpdate(example, function () {
          if (counter++) {
            throw 'Called more than once!';
          }
        });

    Store.notifyUpdate(example);
    unregister.call();
    Store.notifyUpdate(example);
  });


  afterEach(function () {
    Store.clearAllListeners();
  });
});
