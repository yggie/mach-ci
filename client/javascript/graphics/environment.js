'use strict';

import THREE from 'three';

let path = (window.location.protocol === 'file:') ? '../assets' : 'assets';

let envMap = THREE.ImageUtils.loadTextureCube([
  path + '/textures/miramar_ft.jpg',
  path + '/textures/miramar_bk.jpg',
  path + '/textures/miramar_rt.jpg',
  path + '/textures/miramar_lf.jpg',
  path + '/textures/miramar_up.jpg',
  path + '/textures/miramar_dn.jpg'
]);
envMap.format = THREE.RGBFormat;

export default class Environment {
  constructor(scene, camera) {
    this._backgroundScene = new THREE.Scene();
    this._camera = camera.clone();
    this._camera.position.set(0, 0, 0);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    let ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    let shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = window.reflectionCube;

    let material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });

    let mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material);
    this._backgroundScene.add(mesh);
  }

  onCameraUpdate(camera) {
    let myCamera = this._camera;

    myCamera.aspect = camera.aspect;
    myCamera.updateProjectionMatrix();
  }

  envMap() {
    return envMap;
  }

  render(renderer, camera) {
    this._camera.rotation.copy(camera.rotation);

    let position = camera.position.clone();
    let length = position.length();

    position.setLength(Math.min(length * 0.001, 5));

    this._camera.position.copy(position);

    renderer.render(this._backgroundScene, this._camera);
  }
}
