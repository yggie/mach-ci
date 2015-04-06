/* global React:false */

import TestSuite from './models/test-suite';

let logsElement = document.getElementById('logs'),
    testSuite = null;

if (logsElement) {
  let logs = logsElement.innerText;
  testSuite = TestSuite.create(logs);
}

let app = (
  /* jshint ignore:start */
  <h1>Hello World!</h1>
  /* jshint ignore:end */
);

React.render(app, document.body);

// (function (document, window, THREE) {
//   'use strict';
//
//   let parentDiv = document.getElementById('the-display'),
//       renderer = new THREE.WebGLRenderer({
//         antialias: true,
//       }),
//       camera = new THREE.PerspectiveCamera(45, 1.0, 1, 100),
//       scene = new THREE.Scene();
//
//   camera.position.z = 5;
//   renderer.setPixelRatio(window.devicePixelRatio);
//   parentDiv.appendChild(renderer.domElement);
//
//   let animate = function () {
//     window.requestAnimationFrame(animate);
//
//     camera.aspect = parentDiv.clientWidth / parentDiv.clientHeight;
//     renderer.setSize(parentDiv.clientWidth, parentDiv.clientHeight);
//
//     renderer.render(scene, camera);
//   };
//
//   let cases = TestCase.buildFromFullLogs(document.getElementById('logs').innerText);
//   console.log(cases);
//
//   cases[0].prepareRender(scene);
//
//   animate();
// }).call(this, document, window, THREE);
