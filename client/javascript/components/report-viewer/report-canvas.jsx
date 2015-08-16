'use strict';

import React from 'react';
import THREE from 'three';
import classNames from 'classnames';

import ReportEntity from '../../graphics/report-entity';
import OrbitCameraControlledCanvas from './orbit-camera-controlled-canvas.jsx';

export default class ReportCanvas extends React.Component {
  constructor() {
    super();

    let camera = new THREE.PerspectiveCamera(45, 1.0, 1, 100);
    camera.position.set(0, 0, 5);

    this.state = {
      reportEntity: new ReportEntity(null),
      camera: camera
    };
  }


  componentDidMount() {
    let canvas = React.findDOMNode(this.refs.canvas),
        renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true
        }),
        scene = new THREE.Scene();

    this.setState({
      canvas: canvas,
      renderer: renderer,
      scene: scene,
      keepAnimating: true,
      reportEntity: new ReportEntity(this.props.report)
    }, function () {
      this.prepareToAnimate();

      this.animate();
    }.bind(this));
  }


  componentWillReceiveProps(nextProps) {
    var props = this.props;

    if (nextProps.report !== props.report) {
      let scene = this.state.scene,
          reportEntity = this.state.reportEntity;

      reportEntity.bodies.forEach(function (body) {
        scene.remove(body.mesh);
      });

      this.setState({
        reportEntity: new ReportEntity(nextProps.report)
      }, this.prepareToAnimate);
    }

    if (nextProps.frame !== props.frame) {
      this.state.reportEntity.setFrame(nextProps.frame);
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

    let element = React.findDOMNode(this);
    let parent = element.parentElement;
    let renderer = this.state.renderer;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(parent.clientWidth, parent.clientHeight);

    reportEntity.bodies.forEach(function (body) {
      scene.add(body.mesh);
    });
  }


  animate = () => {
    let canvas = this.state.canvas,
        camera = this.state.camera,
        scene = this.state.scene,
        renderer = this.state.renderer,
        animate = this.animate;

    if (this.state.keepAnimating) {
      setTimeout(function () {
        window.requestAnimationFrame(animate);
      }, 30);
    }

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    // scene.updateMatrixWorld(true);
    // let translation = new THREE.Vector3(0, 0, 0);
    // camera.matrixWorld.decompose(translation, new THREE.Quaternion(), new THREE.Vector3());
    // console.log(translation, translation.lengthSq());

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
