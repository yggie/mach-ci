/* global THREE:false */

import Body from '../../client/javascript/models/body';

describe('Body', function () {
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
  });
});
