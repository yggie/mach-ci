'use strict';

import THREE from 'three';

export default class PointCloud {
  constructor(id) {
    this._id = id;
    this._geometries = [];
    this._threeObjects = [];
    this._material = new THREE.PointCloudMaterial({
      color: '#ffffff',
      size: 0.1
    });
  }

  addPointAtFrame(point, frame) {
    if (!this._geometries[frame]) {
      this._geometries[frame] = new THREE.Geometry();
      this._threeObjects[frame] = new THREE.PointCloud(this._geometries[frame], this._material);
    }

    let geometry = this._geometries[frame];
    geometry.vertices.push(point.clone());
  }

  geometryAt(frame) {
    return this._geometries[frame];
  }


  threeObjectAt(frame) {
    return this._threeObjects[frame];
  }
}
