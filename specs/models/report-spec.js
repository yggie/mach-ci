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
      [CREATE] Body[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
      [CREATE] Body[2]: Pos=[1.356025, 0, 0.2], Rot=[0.888074, 0, 0.325058, -0.325058], Shape=Cube{ w=1, h=1, d=1 }
      ok
    `;

    let bodyIds = Object.keys(report(logs).bodies);
    expect(bodyIds).to.deep.equal(['1', '2']);
  });


  it('records the body states', function () {
    let logs = `
      test core::state::tests::with_velocity_test ...
      [CREATE] Body[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
      [UPDATE] START step=0.2
      [UPDATE] Body[1]: Pos=[-0.178571, 0, 0], Rot=[1, 0, 0, 0]
      [UPDATE] END
      ok
    `;

    let currentBody = report(logs).bodies[1];
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
      test core::state::tests::with_velocity_test ... [RENDERABLE]
      [UPDATE] START step=0.2
      [UPDATE] START step=0.2
      [UPDATE] START step=0.2
      [UPDATE] START step=0.2
      ok
    `;
    expect(report(logs).numberOfFrames).to.equal(4);
  });


  context('with multiple test states', function () {
    it('can return the log snippet associated with the state', function () {
      let logs = `
        test core::state::tests::with_velocity_test ...
        [CREATE] Body[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
        [CREATE] Body[2]: Pos=[0, 0.1, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
        [UPDATE] START step=0.2
        [UPDATE] Body[1]: Pos=[-0.178571, 0, 0], Rot=[1, 0, 0, 0]
        [UPDATE] END
        [UPDATE] START step=0.2
        [UPDATE] Body[1]: Pos=[-0.278571, 1, 0], Rot=[1, 0, 0, 0]
        [UPDATE] Body[2]: Pos=[0, 1.2, 0], Rot=[1, 0, 0, 0]
        [UPDATE] END
        ok
      `;

      var myReport = report(logs);
      expect(myReport.numberOfFrames).to.equal(2);
      expect(myReport.snippets().map(trim)).to.deep.equal([`
        test core::state::tests::with_velocity_test ...
        [CREATE] Body[1]: Pos=[0, 0, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
        [CREATE] Body[2]: Pos=[0, 0.1, 0], Rot=[1, 0, 0, 0], Shape=Cube{ w=1, h=1, d=1 }
        [UPDATE] START step=0.2
        [UPDATE] Body[1]: Pos=[-0.178571, 0, 0], Rot=[1, 0, 0, 0]
        [UPDATE] END
      `, `
        [UPDATE] START step=0.2
        [UPDATE] Body[1]: Pos=[-0.278571, 1, 0], Rot=[1, 0, 0, 0]
        [UPDATE] Body[2]: Pos=[0, 1.2, 0], Rot=[1, 0, 0, 0]
        [UPDATE] END
        ok
      `].map(trim));
    });
  });
});
