'use strict';

import THREE from 'three';

export default class TriangleMesh {
  constructor(id) {
    this._id = id;
    this._geometries = [];
    this._threeObjects = [];
    this._material = new THREE.MeshLambertMaterial({
      color: '#ffffff',
      reflectivity: 0.5
    });
  }


  setEnvironment(environment) {
    this._material.envMap = environment.envMap();
  }


  geometryAt(frame) {
    return this._geometries[frame];
  }


  threeObjectAt(frame) {
    return this._threeObjects[frame];
  }


  addFaceAtFrame(face, frame) {
    if (!this._geometries[frame]) {
      this._geometries[frame] = new THREE.Geometry();
      this._threeObjects[frame] = new THREE.Mesh(this._geometries[frame], this._material);
    }

    let geometry = this._geometries[frame];
    geometry.vertices.push(
      face[0].clone(),
      face[1].clone(),
      face[2].clone()
    );

    let index = geometry.vertices.length - 3;
    geometry.faces.push(new THREE.Face3(index, index + 1, index + 2));
    geometry.computeFaceNormals();
  }
}
