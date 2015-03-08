import { Body } from '../../src/models/body';

describe('Body model', function () {
  'use strict';

  let body = function (options) {
    options = options || {};
    return new Body(
        options.id || 'my id',
        options.position || new THREE.Vector3(0, 0, 0),
        options.rotation || new THREE.Quaternion(0, 0, 0, 1),
        options.geometry || new THREE.BoxGeometry(1, 1, 1)
    );
  };

  it('has an id', function () {
    expect(body().id).to.equal('my id');
  });

  it('has a position', function () {
    let pos = new THREE.Vector3(1, 2, 3);
    expect(body({ position: pos }).position).to.deep.equal(pos);
  });

  it('has a rotation', () => {
    let rot = new THREE.Quaternion(1, 2, 3, 4);
    expect(body({ rotation: rot }).rotation).to.deep.equal(rot);
  });

  it('has a geometry', function () {
    let geom = new THREE.BoxGeometry(1, 2, 3);
    expect(body({ geometry: geom }).geometry).to.deep.equal(geom);
  });

  it('has a material', function () {
    expect(body().material).to.be.an.instanceof(THREE.Material);
  });

  it('has a mesh', function () {
    expect(body().mesh).to.be.an.instanceof(THREE.Mesh);
  });

  it('is initially at state 0', function () {
    expect(body().stateIndex).to.equal(0);
  });

  describe('when updating the Body state', function () {
    let currentBody = null,
        position = null,
        rotation = null;

    beforeEach(function () {
      currentBody = body();
      position = new THREE.Vector3(2, 3, 4);
      rotation = new THREE.Quaternion(0, 1, 0, 0);
      currentBody.addStateAt(1, position, rotation);
      currentBody.useState(1);
    });

    it('updates the body state index', function () {
      expect(currentBody.stateIndex).to.deep.equal(1);
    });

    it('updates the mesh position accordingly', function () {
      expect(currentBody.mesh.position.toArray()).to
        .deep.equal(position.toArray());
    });

    it('updates the mesh rotation accordingly', function () {
      expect(currentBody.mesh.quaternion.toArray()).to
        .deep.equal(rotation.toArray());
    });
  });
});
