'use strict';

import React from 'react';
import THREE from 'three';
import classNames from 'classnames';

import Environment from '../../graphics/environment';
import ReportEntity from '../../graphics/report-entity';
import OrbitCameraControlledCanvas from './orbit-camera-controlled-canvas.jsx';

export default class ReportCanvas extends React.Component {
  constructor() {
    super();

    let camera = new THREE.PerspectiveCamera(45, 1.0, 1, 100);
    camera.position.set(5, 5, 5);

    let scene = new THREE.Scene();
    let environment = new Environment(scene, camera);

    this.state = {
      reportEntity: new ReportEntity(null, environment),
      camera: camera,
      scene: scene,
      environment: environment
    };
  }


  componentDidMount() {
    let canvas = React.findDOMNode(this.refs.canvas),
        renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true
        }),
        environment = this.state.environment;

    this.setState({
      canvas: canvas,
      renderer: renderer,
      keepAnimating: true,
      reportEntity: new ReportEntity(this.props.report, environment)
    }, function () {
      this.prepareToAnimate();

      this.animate();
    }.bind(this));

    let camera = this.state.camera;
    let onWindowResize = function () {
      let body = document.body;

      renderer.setSize(body.clientWidth, body.clientHeight);

      camera.aspect = body.clientWidth / body.clientHeight;
      camera.updateProjectionMatrix();

      environment.onCameraUpdate(camera);
    };

    onWindowResize();
    window.addEventListener('resize', onWindowResize);
  }


  componentWillReceiveProps(nextProps) {
    var props = this.props;
    let environment = this.state.environment;

    if (nextProps.report !== props.report) {
      let scene = this.state.scene,
          reportEntity = this.state.reportEntity;

      reportEntity.cleanup(scene);

      this.setState({
        reportEntity: new ReportEntity(nextProps.report, environment)
      }, this.prepareToAnimate);
    }

    if (nextProps.frame !== props.frame) {
      this.state.reportEntity.setFrame(nextProps.frame, this.state.scene);
    }
  }


  componentWillUnmount() {
    this.setState({
      keepAnimating: false
    });
  }


  prepareToAnimate = () => {
    let reportEntity = this.state.reportEntity;
    let scene = this.state.scene;

    let renderer = this.state.renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;

    reportEntity.initialize(scene);
    reportEntity.setFrame(this.props.frame, scene);
  }


  animate = () => {
    let state = this.state,
        camera = state.camera,
        scene = state.scene,
        environment = state.environment,
        renderer = state.renderer,
        animate = this.animate;

    if (state.keepAnimating) {
      setTimeout(function () {
        window.requestAnimationFrame(animate);
      }, 30);
    }

    // scene.updateMatrixWorld(true);
    // let translation = new THREE.Vector3(0, 0, 0);
    // camera.matrixWorld.decompose(translation, new THREE.Quaternion(), new THREE.Vector3());
    // console.log(translation, translation.lengthSq());

    environment.render(renderer, camera);
    renderer.render(scene, camera);
  }


  render() {
    var state = this.state,
        reportScene = state.reportEntity,
        camera = state.camera;

    return (
      <OrbitCameraControlledCanvas
        ref="canvas"
        camera={camera}
        className={classNames({
          'hidden': !reportScene.canRender
        })}>
      </OrbitCameraControlledCanvas>
    );
  }
}
