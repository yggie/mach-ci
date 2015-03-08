import * as utils from '../src/utils';

describe('utils module', function () {
  'use strict';

  it('can convert a stringified array to a numeric array', function () {
    expect(utils.parseNumericArray(' [-1, 2, 3, -4.01  ]')).to
      .deep.equal([ -1,2, 3, -4.01 ]);
  });

  it('can convert a stringified array into a THREE.Vector3', function () {
    expect(utils.parseVector('[1, -2, 3.3]')).to
      .deep.equal(new THREE.Vector3(1, -2, 3.3));
  });

  it('can convert a stringified array into a THREE.Quaternion', function () {
    expect(utils.parseQuaternion('[1, -1, 4.3, 2.1]')).to
      .deep.equal(new THREE.Quaternion(-1, 4.3, 2.1, 1));
  });

  it('can parse a stringified Cube shape into a THREE.BoxGeometry', function () {
    let expected = new THREE.BoxGeometry(1, 2.2, -3.3),
        geometry = utils.parseGeometry('Cube{ w=1, h=2.2, d=-3.3 }');

    expect(geometry).to.be.an.instanceof(THREE.BoxGeometry);
    expect(geometry.width).to.equal(expected.width);
    expect(geometry.height).to.equal(expected.height);
    expect(geometry.depth).to.equal(expected.depth);
  });
});
