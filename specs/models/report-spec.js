'use strict';

import Report from '../../client/javascript/models/report';

describe('Report model', function () {
  let report = function (logs) {
    return new Report(logs || 'test collisions::tests::sample_test ... fail');
  };

  let trim = function (string) {
    return string.trim().replace(/\s+/g, ' ');
  };


  it('has a copy of the original log snippet', function () {
    expect(report().fullLogs).to.equal('test collisions::tests::sample_test ... fail');
  });


  it('stores the title of the test', function () {
    expect(report().title()).to.equal('collisions::tests::sample_test');
  });


  it('knows if the test was successful or not', function () {
    expect(report().didPass()).to.be.false;
  });


  it('records all created bodies', function () {
    let logs = `
      test core::state::tests::with_velocity_test ...
      [NEW] RigidBody[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
      [NEW] RigidBody[2]: Pos=[1.356025, 0, 0.2], Rot=[0.888074, 0, 0.325058, -0.325058], Shape=Cube{ w=1, h=1, d=1 }
      ok
    `;

    let bodyIds = Object.keys(report(logs).bodies);
    expect(bodyIds).to.deep.equal(['1', '2']);
  });


  it('records all created static bodies', function () {
    let logs = `
      test core::state::tests::with_velocity_test ...
      [NEW] StaticBody[3]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
      ok
    `;

    let bodyIds = Object.keys(report(logs).bodies);
    expect(bodyIds).to.deep.equal(['3']);
  });


  it('records the body states', function () {
    let logs = `
      test core::state::tests::with_velocity_test ...
      [NEW] RigidBody[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
      [NEW] StaticBody[2]: Pos=[0, 1, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
      [FRAME] NEW step=0.2
      [FRAME] RigidBody[1]: Pos=[-0.178571, 0, 0], Rot=[1, 0, 0, 0]
      [FRAME] StaticBody[2]: Pos=[0, 1, 0], Rot=[1, 0, 0, 0]
      ok
    `;

    let bodies = report(logs).bodies;
    expect(bodies[1].states.length).to.equal(2);
    expect(bodies[2].states.length).to.equal(2);

    bodies[1].useState(0);
    expect(bodies[1].position.toArray()).to.deep.equal([0, 0, 0]);
    expect(bodies[1].rotation.toArray()).to.deep.equal([0, 0, 0, 1]);

    bodies[1].useState(1);
    expect(bodies[1].position.toArray()).to.deep.equal([-0.178571, 0, 0]);
    expect(bodies[1].rotation.toArray()).to.deep.equal([0, 0, 0, 1]);

    bodies[2].useState(0);
    expect(bodies[2].position.toArray()).to.deep.equal([0, 1, 0]);
    expect(bodies[2].rotation.toArray()).to.deep.equal([0, 0, 0, 1]);

    bodies[2].useState(1);
    expect(bodies[2].position.toArray()).to.deep.equal([0, 1, 0]);
    expect(bodies[2].rotation.toArray()).to.deep.equal([0, 0, 0, 1]);
  });


  it('stores the number of simulation steps taken', function () {
    let logs = `
      test core::state::tests::with_velocity_test ... [RENDERABLE]
      [FRAME] NEW step=0.2
      [FRAME] NEW step=0.2
      [FRAME] NEW step=0.2
      [FRAME] NEW step=0.2
      ok
    `;
    expect(report(logs).numberOfFrames).to.equal(4);
  });


  context('with multiple test states', function () {
    it('can return the log snippet associated with the state', function () {
      let logs = `
        test core::state::tests::with_velocity_test ...
        [NEW] RigidBody[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
        [NEW] RigidBody[2]: Pos=[0, 0.1, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
        [FRAME] NEW step=0.2
        [FRAME] RigidBody[1]: Pos=[-0.178571, 0, 0], Rot=[1, 0, 0, 0]
        [FRAME] NEW step=0.2
        [FRAME] RigidBody[1]: Pos=[-0.278571, 1, 0], Rot=[1, 0, 0, 0]
        [FRAME] RigidBody[2]: Pos=[0, 1.2, 0], Rot=[1, 0, 0, 0]
        ok
      `;

      var myReport = report(logs);
      expect(myReport.numberOfFrames).to.equal(2);
      expect(myReport.snippets().map(trim)).to.deep.equal([`
        test core::state::tests::with_velocity_test ...
        [NEW] RigidBody[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
        [NEW] RigidBody[2]: Pos=[0, 0.1, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
        [FRAME] NEW step=0.2
        [FRAME] RigidBody[1]: Pos=[-0.178571, 0, 0], Rot=[1, 0, 0, 0]
      `, `
        [FRAME] NEW step=0.2
        [FRAME] RigidBody[1]: Pos=[-0.278571, 1, 0], Rot=[1, 0, 0, 0]
        [FRAME] RigidBody[2]: Pos=[0, 1.2, 0], Rot=[1, 0, 0, 0]
        ok
      `].map(trim));
    });
  });
});
