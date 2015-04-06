import React from 'react';
import $ from 'jquery';

import TestCasesList from './components/test-cases-list.jsx';
import TestSuite from './models/test-suite';

export default class Application extends React.Component {
  constructor() {
    super();

    let logsElement = document.getElementById('logs'),
        logs = '';

    if (logsElement) {
      logs = logsElement.innerText;
    }

    this.state = {
      testSuite: TestSuite.create(logs)
    };
  }


  componentDidMount() {
    var self = this;

    $.ajax({
      url: '/sample-05-04-2015.log',
      success: function (result) {
        var suite = TestSuite.create(result);
        self.setState({
          testSuite: suite
        });
      }
    });
  }


  render() {
    return (
      /* jshint ignore:start */
        <main>
          <h1>Hello World!</h1>
          <TestCasesList testSuite={this.state.testSuite} />
        </main>
      /* jshint ignore:end */
    );
  }
}

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
