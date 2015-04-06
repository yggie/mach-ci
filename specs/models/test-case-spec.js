import TestCase from '../../client/javascript/models/test-case';

describe('TestCase model', function () {
  'use strict';

  let testCase = function (logs) {
    return new TestCase(logs || 'test collisions::tests::sample_test ... fail');
  };


  it('has a copy of the original log snippet', function () {
    expect(testCase().snippet()).to.equal('test collisions::tests::sample_test ... fail');
  });


  it('stores the title of the test', function () {
    expect(testCase().title()).to.equal('collisions::tests::sample_test');
  });


  it('knows if the test was successful or not', function () {
    expect(testCase().didPass()).to.be.false;
  });


  it('records all created bodies', function () {
    let logs = `
      test core::state::tests::with_velocity_test ...
      [Collisions create_body] Body[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
      [Collisions create_body] Body[2]: Pos=[1.356025, 0, 0.2], Rot=[0.888074, 0, 0.325058, -0.325058], Shape=Cube{ w=1, h=1, d=1 }
      ok
    `;

    let bodyIds = Object.keys(testCase(logs).bodies);
    expect(bodyIds).to.deep.equal(['1', '2']);
  });


  it('records the body states', function () {
    let logs = `
      test core::state::tests::with_velocity_test ...
      [Collisions create_body] Body[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
      [Dynamics update] START step=0.2
      [Dynamics update] Body[1]: Pos=[-0.178571, 0, 0], Rot=[1, 0, 0, 0]
      [Dynamics update] END
      ok
    `;

    let currentBody = testCase(logs).bodies[1];
    expect(currentBody.states.length).to.equal(2);

    currentBody.useState(0);
    expect(currentBody.position.toArray()).to.deep.equal([0, 0, 0]);
    expect(currentBody.rotation.toArray()).to.deep.equal([0, 0, 0, 1]);

    currentBody.useState(1);
    expect(currentBody.position.toArray()).to.deep.equal([-0.178571, 0, 0]);
    expect(currentBody.rotation.toArray()).to.deep.equal([0, 0, 0, 1]);
  });


  it('stores the number of simulation steps taken', function () {
    let logs = `
      test core::state::tests::with_velocity_test ... [Dynamics update] START step=0.2
      [Dynamics update] START step=0.2
      [Dynamics update] START step=0.2
      [Dynamics update] START step=0.2
      ok
    `;
    expect(testCase(logs).numberOfSteps).to.equal(4);
  });
});
