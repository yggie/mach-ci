'use strict';

import React from 'react';
import THREE from 'three';
import classNames from 'classnames';

import ReportEntity from '../../../graphics/report-entity';
import OrbitCameraControlledCanvas from './orbit-camera-controlled-canvas.jsx';

export default class ReportCanvas extends React.Component {
  constructor() {
    super();

    this.state = {
      reportEntity: new ReportEntity(null)
    };
  }


  componentDidMount() {
    let canvas = React.findDOMNode(this.refs.canvas),
        renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true
        }),
        camera = new THREE.PerspectiveCamera(45, 1.0, 1, 100),
        scene = new THREE.Scene();

    this.setState({
      canvas: canvas,
      renderer: renderer,
      camera: camera,
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
      }, this.prepareToAnimate.bind(this));
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


  prepareToAnimate() {
    let element = React.findDOMNode(this),
        parent = element.parentElement,
        reportEntity = this.state.reportEntity,
        camera = this.state.camera,
        scene = this.state.scene,
        renderer = this.state.renderer;

    camera.position.set(0, 0, 5);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(parent.clientWidth, parent.clientWidth * 9 / 14);

    reportEntity.bodies.forEach(function (body) {
      scene.add(body.mesh);
    });
  }


  animate() {
    let canvas = this.state.canvas,
        camera = this.state.camera,
        scene = this.state.scene,
        renderer = this.state.renderer,
        animate = this.animate.bind(this);

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
