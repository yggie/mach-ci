'use strict';

import React from 'react';
import THREE from 'three';

export default class OrbitCameraControlledCanvas extends React.Component {
  useCamera(camera) {
    this._camera = camera;
    this._center = new THREE.Vector3(0.0, 0.0, 0.0);
    this._up = new THREE.Vector3(0.0, 1.0, 0.0);
    this._eye = new THREE.Vector3(0.0, 0.0, 5.0);
    this._zView = (new THREE.Vector3().copy(this._eye).sub(this._center)).normalize();

    this._zoom = this._eye.length();

    this._rotAnchor = null;
  }


  nextRotationEvent(point) {
    if (this._rotAnchor) {
      let diff = point.clone().sub(this._rotAnchor),
          length = diff.length(),
          zView = this._zView.clone(),
          xView = this._up.clone().cross(zView).normalize(),
          yView = zView.clone().cross(xView).normalize(),
          axis = (xView.clone().multiplyScalar(diff.y).add(yView.clone().multiplyScalar(-diff.x))).normalize();

      this._zView.applyAxisAngle(axis, length / 100).normalize();
      this._up.copy(yView);
      this._rotAnchor.copy(point);
    } else {
      this._rotAnchor = point;
    }

    this.updateCamera();
  }


  nextZoomEvent(zoom) {
    this._zoom *= (1.0 + zoom.y / 100.0);

    this.updateCamera();
  }


  updateCamera() {
    let camera = this._camera;

    camera.position.copy(this._zView.clone().multiplyScalar(this._zoom));
    camera.up.copy(this._up);
    camera.lookAt(this._center);
  }


  endCameraControl() {
    this.endRotationControl();

    this.setState({
      cameraControlEnabled: false
    });
  }


  endRotationControl() {
    this._rotAnchor = null;

    this.setState({
      rotationControlEnabled: false
    });
  }


  componentDidMount() {
    this.setState({
      canvas: React.findDOMNode(this.refs.canvas),
      cameraControlEnabled: false
    });
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.camera !== nextProps.camera || this.props.className !== nextProps.className) {
      this.useCamera(nextProps.camera);
    }
  }


  canvasOnMouseMove(event) {
    let state = this.state;

    if (state.cameraControlEnabled && state.rotationControlEnabled) {
      this.nextRotationEvent(new THREE.Vector2(event.pageX, event.pageY));
    }
  }


  canvasOnWheel(event) {
    let state = this.state;

    if (state.cameraControlEnabled) {
      event.preventDefault();
      event.stopPropagation();

      this.nextZoomEvent(new THREE.Vector2(event.deltaX, event.deltaY));
    }
  }


  enableCameraControls() {
    this.setState({
      cameraControlEnabled: true
    });
  }


  startRotationControls() {
    this.setState({
      rotationControlEnabled: true
    });
  }


  render() {
    return (
      <canvas
        ref="canvas"
        tabIndex="-1"
        className={this.props.className}
        onFocus={this.enableCameraControls.bind(this)}
        onMouseDown={this.startRotationControls.bind(this)}
        onMouseLeave={this.endCameraControl.bind(this)}
        onMouseUp={this.endRotationControl.bind(this)}
        onMouseMove={this.canvasOnMouseMove.bind(this)}
        onWheel={this.canvasOnWheel.bind(this)}>
      </canvas>
    );
  }
}
