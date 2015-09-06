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


  it('stores the number of simulation steps taken', function () {
    let logs = `
      test core::state::tests::with_velocity_test ...
      [FRAME] NEW step=0.2
      [FRAME] NEW step=0.2
      [FRAME] NEW step=0.2
      [FRAME] NEW step=0.2
      ok
    `;
    expect(report(logs).numberOfFrames).to.equal(4);
  });


  context('with physical entities', function () {
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
  });


  context('with arbitrary shapes', function () {
    context('such as point clouds', function () {
      it('can capture multiple point clouds', function () {
        let logs = `
          test core::state::tests::with_velocity_test ...
          [FRAME] NEW step=0.2
          [FRAME] PointCloud[0]: [0, 0, 0]
          [FRAME] PointCloud[1]: [0, 0, 0]
          ok
        `;

        let pointClouds = report(logs).pointClouds();
        expect(pointClouds.length).to.equal(2);
      });


      it('can capture all the points that make up a point cloud in a frame', function () {
        let logs = `
          test core::state::tests::with_velocity_test ...
          [FRAME] PointCloud[0]: [0, 0, 1]
          [FRAME] PointCloud[0]: [0, 0, 2]
          [FRAME] PointCloud[0]: [0, 0, 3]
          ok
        `;

        let pointCloud = report(logs).pointClouds()[0];
        let geometry = pointCloud.geometryAt(0);

        expect(geometry.vertices.length).to.equal(3);
        expect(geometry.vertices[0]).to.deep.equal(new THREE.Vector3(0, 0, 1));
        expect(geometry.vertices[1]).to.deep.equal(new THREE.Vector3(0, 0, 2));
        expect(geometry.vertices[2]).to.deep.equal(new THREE.Vector3(0, 0, 3));
      });


      it('can capture all the points that make up a point cloud in a frame', function () {
        let logs = `
          test core::state::tests::with_velocity_test ...
          [FRAME] PointCloud[0]: [0, 0, 1]
          [FRAME] PointCloud[0]: [0, 0, 2]
          [FRAME] PointCloud[0]: [0, 0, 3]
          ok
        `;

        let pointCloud = report(logs).pointClouds()[0];
        let geometry = pointCloud.geometryAt(0);

        expect(geometry.vertices.length).to.equal(3);
        expect(geometry.vertices[0]).to.deep.equal(new THREE.Vector3(0, 0, 1));
        expect(geometry.vertices[1]).to.deep.equal(new THREE.Vector3(0, 0, 2));
        expect(geometry.vertices[2]).to.deep.equal(new THREE.Vector3(0, 0, 3));
      });


      it('independently captures points for each frame', function () {
        let logs = `
          test core::state::tests::with_velocity_test ...
          [FRAME] PointCloud[0]: [0, 0, 1]
          [FRAME] PointCloud[0]: [0, 0, 2]
          [FRAME] NEW step=0.2
          [FRAME] PointCloud[0]: [0, 0, 3]
          ok
        `;

        let pointCloud = report(logs).pointClouds()[0];
        expect(pointCloud.geometryAt(0).vertices.length).to.equal(2);
        expect(pointCloud.geometryAt(1).vertices.length).to.equal(1);
      });
    });


    // TODO
    // context('such as arrows', function () {
    // });


    context('such as triangle meshes', function () {
      it('can capture multiple triangle meshes', function () {
        let logs = `
          test core::state::tests::with_velocity_test ...
          [FRAME] TriangleMesh[0]: [0, 0, 0] -> [0, 1, 0] -> [0, 0, 1]
          [FRAME] TriangleMesh[1]: [0, 0, 0] -> [0, 1, 0] -> [0, 0, 1]
          ok
        `;

        let triangleMeshes = report(logs).triangleMeshes();
        expect(triangleMeshes.length).to.equal(2);
      });


      it('can capture all the faces that make up mesh in a frame', function () {
        let logs = `
          test core::state::tests::with_velocity_test ...
          [FRAME] TriangleMesh[0]: [0, 0, 0] -> [0, 1, 0] -> [0, 0, 1]
          [FRAME] TriangleMesh[0]: [0, 1, 0] -> [1, 1, 0] -> [0, 0, 1]
          [FRAME] TriangleMesh[0]: [0, 0, 1] -> [0, 1, 0] -> [0, 1, 1]
          ok
        `;

        let triangleMesh = report(logs).triangleMeshes()[0];
        let geometry = triangleMesh.geometryAt(0);

        expect(geometry.faces.length).to.equal(3);

        expect(geometry.vertices).to.include(new THREE.Vector3(0, 0, 0));
        expect(geometry.vertices).to.include(new THREE.Vector3(0, 0, 1));
        expect(geometry.vertices).to.include(new THREE.Vector3(0, 1, 0));
        expect(geometry.vertices).to.include(new THREE.Vector3(0, 1, 1));
        expect(geometry.vertices).to.include(new THREE.Vector3(1, 1, 0));
      });


      it('independently captures faces for each frame', function () {
        let logs = `
          test core::state::tests::with_velocity_test ...
          [FRAME] TriangleMesh[0]: [0, 0, 0] -> [0, 1, 0] -> [0, 0, 1]
          [FRAME] NEW step=0.2
          [FRAME] TriangleMesh[0]: [0, 1, 0] -> [0, 0, 0] -> [1, 0, 1]
          [FRAME] TriangleMesh[0]: [0, 0, 0] -> [0, 1, 0] -> [1, 1, 1]
          ok
        `;

        let triangleMesh = report(logs).triangleMeshes()[0];
        expect(triangleMesh.geometryAt(0).faces.length).to.equal(1);
        expect(triangleMesh.geometryAt(1).faces.length).to.equal(2);
      });
    });
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
