'use strict';

import React from 'react';
import THREE from 'three';
import classNames from 'classnames';

import ReportEntity from '../../../graphics/report-entity';
import CameraController from '../../../graphics/camera-controller';

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
      enableCameraControl: false,
      cameraController: new CameraController(camera),
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


  canvasOnMouseMove(event) {
    let state = this.state;

    if (state.enableCameraControl && event.altKey) {
      let canvas = this.state.canvas;

      var offset = { x: canvas.offsetLeft, y: canvas.offsetTop },
          parent = canvas.offsetParent;

      // the weirdness of HTML to get the relative position from the current
      // element
      while (parent) {
        offset.x += parent.offsetLeft;
        offset.y += parent.offsetTop;
        parent = parent.offsetParent;
      }

      // we want to ensure the pixel scales of the two measures are equal
      state.cameraController.nextRotationEvent({
        x: (event.pageX - offset.x) / canvas.clientWidth,
        y: (event.pageY - offset.y) / canvas.clientWidth
      });
    }
  }


  canvasOnKeyUp(event) {
    if (event.key === 'Alt') {
      this.endCameraControl();
    }
  }


  canvasOnFocus() {
    this.setState({
      enableCameraControl: true
    });
  }


  canvasOnBlur() {
    this.endCameraControl();
  }


  endCameraControl() {
    this.state.cameraController.endAllEvents();
  }


  animate() {
    let canvas = this.state.canvas,
        camera = this.state.camera,
        controller = this.state.cameraController,
        scene = this.state.scene,
        renderer = this.state.renderer,
        animate = this.animate.bind(this);

    if (this.state.keepAnimating) {
      setTimeout(function () {
        window.requestAnimationFrame(animate);
      }, 30);
    }

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    // camera.matrixWorld = controller.viewMatrix();
    // camera.matrixAutoUpdate = false;
    controller.apply();
    // scene.updateMatrixWorld(true);
    // let translation = new THREE.Vector3(0, 0, 0);
    // camera.matrixWorld.decompose(translation, new THREE.Quaternion(), new THREE.Vector3());
    // console.log(translation, translation.lengthSq());

    renderer.render(scene, camera);
  }


  render() {
    var reportScene = this.state.reportEntity;

    return (
      <canvas
        ref="canvas"
        tabIndex="-1"
        onFocus={this.canvasOnFocus.bind(this)}
        onBlur={this.canvasOnBlur.bind(this)}
        onKeyUp={this.canvasOnKeyUp.bind(this)}
        onMouseMove={this.canvasOnMouseMove.bind(this)}
        className={classNames({
          'hidden': !reportScene.canRender
        })}>
      </canvas>
    );
  }
}
