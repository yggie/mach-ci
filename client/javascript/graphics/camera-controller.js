'use strict';

import THREE from 'three';

export default class CameraController {
  constructor(camera) {
    this._camera = camera;
    this._center = new THREE.Vector3(0.0, 0.0, 0.0);
    this._up = new THREE.Vector3(0.0, 1.0, 0.0);
    this._eye = new THREE.Vector3(0.0, 0.0, 5.0);

    this._tempEye = this._eye.clone();
    this._baseAxis = new THREE.Vector3(0, 0, 1);

    this._rotAnchor = null;
  }


  endAllEvents() {
    this.endRotationEvent();
  }


  endRotationEvent() {
    // this._tempEye.copy(this._eye);
    this._eye.copy(this._tempEye);
    this._rotAnchor = null;
  }


  nextRotationEvent(event) {
    if (this._rotAnchor) {
      let controlPoint = new THREE.Vector2(event.x, event.y),
          diff = controlPoint.clone().sub(this._rotAnchor),
          length = diff.lengthSq();

      if (length > 0.00001) {
        let centerToEye = this._eye.clone().sub(this._center),
            zView = centerToEye.clone().normalize(),
            xView = this._up.clone().cross(zView).normalize(),
            yView = zView.clone().cross(xView).normalize(),
            axis = (xView.multiplyScalar(diff.y).add(yView.multiplyScalar(diff.x))).multiplyScalar(-1).normalize();

        this._tempEye.copy(centerToEye).applyAxisAngle(axis, 4 * length).add(this._center);
      }
    } else {
      this._rotAnchor = new THREE.Vector2(event.x, event.y);
    }
  }


  apply() {
    let camera = this._camera;

    camera.position.copy(this._tempEye);
    // TODO this has a singularity somewhere which causes the tumble
    camera.quaternion.setFromUnitVectors(
      this._baseAxis,
      this._tempEye.clone().sub(this._center).normalize()
    );
  }
}
