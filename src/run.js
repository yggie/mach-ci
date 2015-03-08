import { TestCase } from './models/test-case';

(function (document, window, THREE) {
  'use strict';

  let parentDiv = document.getElementById('the-display'),
      renderer = new THREE.WebGLRenderer({
        antialias: true,
      }),
      camera = new THREE.PerspectiveCamera(45, 1.0, 1, 100),
      scene = new THREE.Scene();

  camera.position.z = 5;
  renderer.setPixelRatio(window.devicePixelRatio);
  parentDiv.appendChild(renderer.domElement);

  let animate = function () {
    window.requestAnimationFrame(animate);

    camera.aspect = parentDiv.clientWidth / parentDiv.clientHeight;
    renderer.setSize(parentDiv.clientWidth, parentDiv.clientHeight);

    renderer.render(scene, camera);
  };

  let cases = TestCase.buildFromFullLogs(document.getElementById('logs').innerText);
  console.log(cases);

  cases[0].prepareRender(scene);

  animate();
}).call(this, document, window, THREE);
