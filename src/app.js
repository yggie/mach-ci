(function (window, document, THREE) {
  'use strict';

  var parseNumericArray = function (string) {
    return string.trim().substr(1, string.length - 2).split(',').map(function (element) {
      return parseFloat(element);
    });
  };

  var parseVector = function (string) {
    var array = parseNumericArray(string);
    return new THREE.Vector3(array[0], array[1], array[2]);
  };

  var parseQuaternion = function (string) {
    var array = parseNumericArray(string);
    return new THREE.Quaternion(array[1], array[2], array[3], array[0]);
  };

  var parseGeometry = function (string) {
    var match = null;

    match = string.match(/Cube{ w=(-?\d+(?:\.\d+)?), h=(-?\d+(?:\.\d+)?), d=(-?\d+(?:\.\d+)?) }/);
    if (match) {
      var width = parseFloat(match[1]),
          height = parseFloat(match[2]),
          depth = parseFloat(match[3]);
      return new THREE.BoxGeometry(width, height, depth);
    }

    throw 'Unable to parse shape from string: "' + string + '"';
  };

  function Body(id, position, rotation, geometry) {
    this.id = id;
    this.geometry = geometry;
    this.material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
    this.states = [{
      pos: position,
      rot: rotation
    }];

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  Body.prototype.pushState = function (index, position, rotation) {
    this.states[index] = {
      pos: position,
      rot: rotation
    };
  };

  Body.prototype.useState = function (index) {
    this.mesh.position.copy(this.states[index].pos);
    this.mesh.quaternion.copy(this.states[index].rot);
  };


  function TestCase(logs) {
    var self = this;
    self._logs = logs;
    self.bodies = {};

    var currentStep = 0;
    logs.split('|').forEach(function (line) {
      var match = null,
          id = null,
          position = null,
          rotation = null,
          geometry = null;

      match = line.match(/---- (.*) stdout ----/);
      if (match) {
        self.title = match[1];
        return;
      }

      match = line.match(/\[Collisions create_body\] Body\[(.+)\]: Pos=(.+), Rot=(.+), Shape=(.+)/);
      if (match) {
        id = match[1];
        position = parseVector(match[2]);
        rotation = parseQuaternion(match[3]);
        geometry = parseGeometry(match[4]);

        self.bodies[id] = new Body(id, position, rotation, geometry);
        return;
      }

      match = line.match(/\[Dynamics update\] START/);
      if (match) {
        currentStep = currentStep + 1;
        return;
      }

      match = line.match(/\[Dynamics update\] Body\[(.+)\]: Pos=(.+), Rot=(.+)/);
      if (match) {
        id = match[1];
        position = parseVector(match[2]);
        rotation = parseQuaternion(match[3]);

        self.bodies[id].pushState(currentStep, position, rotation);
        return;
      }
    });

    self.length = currentStep;
  }


  TestCase.buildFromFullLogs = function (fullLog) {
    var matches = fullLog.match(/----.+----[\s\S]+/g);

    return (matches || []).map(function (logs) {
      return new TestCase(logs);
    });
  };


  TestCase.prototype.prepareRender = function (scene) {
    for (var id in this.bodies) {
      var body = this.bodies[id];
      body.useState(0);
      scene.add(body.mesh);
    }
  };


  var parentDiv = document.getElementById('the-display'),
      renderer = new THREE.WebGLRenderer({
        antialias: true,
      }),
      camera = new THREE.PerspectiveCamera(45, 1.0, 1, 100),
      scene = new THREE.Scene();

  camera.position.z = 5;
  renderer.setPixelRatio(window.devicePixelRatio);
  parentDiv.appendChild(renderer.domElement);

  var animate = function () {
    window.requestAnimationFrame(animate);

    camera.aspect = parentDiv.clientWidth / parentDiv.clientHeight;
    renderer.setSize(parentDiv.clientWidth, parentDiv.clientHeight);

    renderer.render(scene, camera);
  };

  var cases = TestCase.buildFromFullLogs(document.getElementById('logs').innerText);
  console.log(cases);

  cases[0].prepareRender(scene);

  animate();
}).call(this, window, document, THREE);
