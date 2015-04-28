/* global THREE:false */

'use strict';

import Body from '../../client/javascript/models/body';

describe('Body', function () {
  let body = function (options) {
    options = options || {};
    return new Body(
        options.id || 'my id',
        options.position || new THREE.Vector3(0, 0, 0),
        options.rotation || new THREE.Quaternion(0, 0, 0, 1),
        options.geometry || 'Cube {}'
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

  it('has a geometry description', function () {
    expect(body({ geometry: 'Sphere {}' }).geometryDescription).to.equal('Sphere {}');
  });

  it('has the initial state set to the first state', function () {
    expect(body().currentState).to.equal(0);
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

    it('updates the body state', function () {
      expect(currentBody.currentState).to.deep.equal(1);
    });
  });
});
