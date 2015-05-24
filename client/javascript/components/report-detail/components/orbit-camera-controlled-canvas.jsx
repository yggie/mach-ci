'use strict';

import React from 'react';
import THREE from 'three';

export default class OrbitCameraControlledCanvas extends React.Component {
  useCamera(camera) {
    this._camera = camera;
    this._center = new THREE.Vector3(0.0, 0.0, 0.0);
    this._up = new THREE.Vector3(0.0, 1.0, 0.0);
    this._eye = new THREE.Vector3(0.0, 0.0, 5.0);

    this._tempEye = this._eye.clone();
    this._baseAxis = new THREE.Vector3(0, 0, 1);

    this._rotAnchor = null;
  }


  nextRotationEvent(event) {
    if (this._rotAnchor) {
      let controlPoint = new THREE.Vector2(event.x, event.y),
          diff = controlPoint.clone().sub(this._rotAnchor),
          length = diff.lengthSq();

      if (length > 0.00001) {
        let centerToEye = this._eye.clone().sub(this._center),
            zView = centerToEye.clone().normalize(),
            xView = this._up.clone().cross(zView).normalize(),
            yView = zView.clone().cross(xView).normalize(),
            axis = (xView.multiplyScalar(diff.y).add(yView.multiplyScalar(diff.x))).multiplyScalar(-1).normalize();

        this._tempEye.copy(centerToEye).applyAxisAngle(axis, 4 * length).add(this._center);
      }
    } else {
      this._rotAnchor = new THREE.Vector2(event.x, event.y);
    }

    let camera = this._camera;

    camera.position.copy(this._tempEye);
    // TODO this has a singularity somewhere which causes the tumble
    camera.quaternion.setFromUnitVectors(
      this._baseAxis,
      this._tempEye.clone().sub(this._center).normalize()
    );
  }


  endCameraControl() {
    // this._tempEye.copy(this._eye);
    this._eye.copy(this._tempEye);
    this._rotAnchor = null;
  }


  componentDidMount() {
    this.setState({
      canvas: React.findDOMNode(this.refs.canvas),
      enableCameraControl: false
    });
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.camera !== nextProps.camera || this.props.className !== nextProps.className) {
      this.useCamera(nextProps.camera);
    }
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
      this.nextRotationEvent({
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


  render() {
    return (
      <canvas
        ref="canvas"
        tabIndex="-1"
        className={this.props.className}
        onFocus={this.canvasOnFocus.bind(this)}
        onBlur={this.canvasOnBlur.bind(this)}
        onKeyUp={this.canvasOnKeyUp.bind(this)}
        onMouseMove={this.canvasOnMouseMove.bind(this)}>
      </canvas>
    );
  }
}
