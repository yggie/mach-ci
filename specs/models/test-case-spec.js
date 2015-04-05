import { TestCase } from '../../client/javascript/models/test-case';

describe('TestCase model', function () {
  'use strict';

  let testCase = function (logs) {
    return new TestCase(logs || 'Default Logs');
  };


  it('has a copy of the original logs', function () {
    let logs = 'some logs';
    expect(testCase(logs).original).to.equal(logs);
  });


  it('stores the title of the test', function () {
    let logs = `
      ---- dynamics::simple_dynamics::tests::update_with_rotating_contact_test stdout ----
    `;
    expect(testCase(logs).title).to.equal('dynamics::simple_dynamics::tests::update_with_rotating_contact_test');
  });


  it('records the bodies created', function () {
    let logs = `
          [Collisions create_body] Body[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
          [Collisions create_body] Body[2]: Pos=[1.356025, 0, 0.2], Rot=[0.888074, 0, 0.325058, -0.325058], Shape=Cube{ w=1, h=1, d=1 }
        `,
        bodyIds = Object.keys(testCase(logs).bodies);
    expect(bodyIds).to.deep.equal(['1', '2']);
  });


  it('records the body states', function () {
    let logs = `
          [Collisions create_body] Body[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
          [Dynamics update] START step=0.2
          [Dynamics update] Body[1]: Pos=[-0.178571, 0, 0], Rot=[1, 0, 0, 0]
          [Dynamics update] END
        `,
        currentBody = testCase(logs).bodies[1];
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
      [Dynamics update] START step=0.2
      [Dynamics update] START step=0.2
      [Dynamics update] START step=0.2
      [Dynamics update] START step=0.2
    `;
    expect(testCase(logs).numberOfSteps).to.equal(4);
  });


  it('can have instances created from a full log file', function () {
    let logs = `
        ---- tests::some_test stdout ----
        ---- tests::some_other_test stdout ----
        `,
        cases = TestCase.buildFromFullLogs(logs);

    expect(cases.length).to.equal(2);
    expect(cases[0].title).to.equal('tests::some_test');
    expect(cases[1].title).to.equal('tests::some_other_test');
  });
});
