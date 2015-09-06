'use strict';

import React from 'react';
import THREE from 'three';

export default class OrbitCameraControlledCanvas extends React.Component {
  useCamera(camera) {
    this._camera = camera;
    this._center = new THREE.Vector3(0.0, 0.0, 0.0);
    this._up = new THREE.Vector3(0.0, 0.0, 1.0);

    let eye = camera.position.clone();
    this._zoom = eye.length();
    this._zView = (new THREE.Vector3().copy(eye).sub(this._center)).normalize();
    this._rotAnchor = null;

    this._defaultCameraEye = camera.position.clone();
    this._defaultCameraCenter = this._center.clone();

    this.updateCamera();
  }


  nextRotationEvent(point) {
    if (this._rotAnchor) {
      let diff = point.clone().sub(this._rotAnchor),
          length = diff.length(),
          zView = this._zView.clone(),
          xView = this._up.clone().cross(zView).normalize(),
          yView = zView.clone().cross(xView).normalize(),
          axis = (xView.clone().multiplyScalar(-diff.y).add(yView.clone().multiplyScalar(-diff.x))).normalize();

      this._zView.applyAxisAngle(axis, length / 100).normalize();
      this._up.copy(yView);
      this._rotAnchor.copy(point);
    } else {
      this._rotAnchor = point.clone();
    }

    this.updateCamera();
  }


  nextZoomEvent(zoom) {
    this._zoom *= (1.0 - zoom.y / 100.0);

    this.updateCamera();
  }


  updateCamera() {
    let camera = this._camera;

    camera.position.copy(this._zView.clone().multiplyScalar(this._zoom));
    camera.up.copy(this._up);
    camera.lookAt(this._center);
  }


  componentDidMount() {
    this.setState({
      canvas: React.findDOMNode(this.refs.canvas)
    });

    this.useCamera(this.props.camera);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.camera !== nextProps.camera || this.props.className !== nextProps.className) {
      this.useCamera(nextProps.camera);
    }
  }


  canvasOnKeyDown = (event) => {
    if (event.keyCode === 190 /* “.” */) {
      this._center.copy(this._defaultCameraCenter);
      this._zView = (new THREE.Vector3().copy(this._defaultCameraEye).sub(this._center)).normalize();

      this.updateCamera();
    }
  }


  canvasOnMouseMove = (event) => {
    let state = this.state;

    if (state.mouseContained && state.mouseDown) {
      this.nextRotationEvent(new THREE.Vector2(event.pageX, event.pageY));
    }
  }


  canvasOnWheel = (event) => {
    let state = this.state;

    if (state.mouseContained) {
      event.preventDefault();
      event.stopPropagation();

      this.nextZoomEvent(new THREE.Vector2(event.deltaX, -event.deltaY));
    }
  }


  canvasOnMouseEnter = () => {
    this.setState({
      mouseContained: true
    });
  }


  canvasOnMouseLeave = () => {
    this._rotAnchor = null;

    this.setState({
      mouseContained: false
    });
  }


  canvasOnMouseUp = () => {
    this._rotAnchor = null;

    this.setState({
      mouseDown: false
    });
  }


  canvasOnMouseDown = () => {
    this.setState({
      mouseDown: true
    });
  }


  render() {
    return (
      <canvas
        ref="canvas"
        tabIndex="-1"
        className={this.props.className}
        onMouseDown={this.canvasOnMouseDown}
        onMouseEnter={this.canvasOnMouseEnter}
        onMouseLeave={this.canvasOnMouseLeave}
        onMouseUp={this.canvasOnMouseUp}
        onMouseMove={this.canvasOnMouseMove}
        onKeyDown={this.canvasOnKeyDown}
        onWheel={this.canvasOnWheel}>
      </canvas>
    );
  }
}
