import Dispatcher from '../client/javascript/dispatcher';
import Store from '../client/javascript/store';

describe('Store', function () {
  'use strict';

  class Example {
    constructor(...args) {
      this.args = args;
    }

    getArgs() {
      return this.args;
    }
  }

  class AnotherExample extends Example {
  }
  Store.register(Example);
  Store.register(AnotherExample);


  it('creates and stores objects in the store', function () {
    let example = Store.create(Example, 1, 2);
    expect(Store.get(example.$id)).to.deep.equal(example);
  });


  it('isolates the stored copy from external changes', function () {
    let example = Store.create(Example, 1, 2);
    example.args.push(3);
    expect(Store.get(example.$id).args).to.deep.equal([1, 2]);
  });


  it('updates objects in the store', function () {
    let example = Store.create(Example, 1, 2);
    example.args.push(3);
    Store.update(example);
    expect(Store.get(example.$id)).to.deep.equal(example);
  });


  it('allows registering to listen for create events', function (done) {
    Store.onCreate(Example, function (example) {
      expect(example.getArgs()).to.deep.equal(['abc']);
      done();
    });
    Store.create(Example, 'abc');
  });


  it('allows registering to listen for update events', function (done) {
    var example = Store.create(Example, 3, 2, 1);
    Store.onUpdate(example, function (example2) {
      expect(example2.getArgs()).to.deep.equal([3, 2, 0]);
      done();
    });
    example.args[2] = 0;
    Store.update(example);
  });


  it('allows immediate execution and registering to listen for update events', function () {
    var example = Store.create(Example),
        counter = 0;

    Store.executeAndRegisterOnUpdate(example, function (arg) {
      expect(arg).to.deep.equal(example);
      counter++;
    });
    Store.update(example);

    expect(counter).to.equal(2);
  });


  it('maintains a list of independent events for each instance', function (done) {
    var example1 = Store.create(Example, 1),
        example2 = Store.create(Example, 2),
        atLeastOne = false;

    Store.onUpdate(example1, function (arg) {
      expect(arg).to.equal(example1);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });
    Store.onUpdate(example2, function (arg) {
      expect(arg).to.equal(example2);
      if (atLeastOne) {
        done();
      }
      atLeastOne = true;
    });

    Store.update(example1);
    Store.update(example2);
  });


  it('maintains a list of independent events for each class', function () {
    var exampleCalled = false,
        anotherExampleCalled = false;

    Store.onCreate(Example, function () {
      if (exampleCalled) {
        throw 'Unexpectedly called more than once!';
      }
      exampleCalled = true;
    });
    Store.onCreate(AnotherExample, function () {
      if (anotherExampleCalled) {
        throw 'Unexpectedly called more than once!';
      }
      anotherExampleCalled = true;
    });

    Store.create(Example, 1);
    Store.create(AnotherExample, 1);
    Dispatcher.flush();
  });


  it('allows unregistering from further events', function () {
    var example = Store.create(Example, 33),
        counter = 0;

    let unregister = Store.onUpdate(example, function () {
          if (counter++) {
            throw 'Called more than once!';
          }
        });

    Store.update(example);
    unregister.call();
    Store.update(example);

    Dispatcher.flush();
  });


  afterEach(function () {
    Dispatcher.clearAllListeners();
  });
});
