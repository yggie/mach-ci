'use strict';

import React from 'react';
import THREE from 'three';

export default class OrbitCameraControlledCanvas extends React.Component {
  useCamera(camera) {
    this._camera = camera;
    this._center = new THREE.Vector3(0.0, 0.0, 0.0);
    this._up = new THREE.Vector3(0.0, 1.0, 0.0);
    this._eye = new THREE.Vector3(0.0, 0.0, 5.0);

    this._baseAxis = new THREE.Vector3(0, 0, 1);

    this._rotAnchor = null;
  }


  nextRotationEvent(point) {
    if (this._rotAnchor) {
      let diff = point.clone().sub(this._rotAnchor),
          length = diff.length(),
          centerToEye = this._eye.clone().sub(this._center),
          zView = centerToEye.clone().normalize(),
          xView = this._up.clone().cross(zView).normalize(),
          yView = zView.clone().cross(xView).normalize(),
          axis = (xView.clone().multiplyScalar(diff.y).add(yView.clone().multiplyScalar(-diff.x))).normalize();

      this._eye.copy(centerToEye).applyAxisAngle(axis, length / 100).add(this._center);
      this._up.copy(yView);
      this._rotAnchor.copy(point);
    } else {
      this._rotAnchor = point;
    }

    let camera = this._camera;

    camera.position.copy(this._eye);
    camera.up.copy(this._up);
    camera.lookAt(this._center);
  }


  endCameraControl() {
    // this._tempEye.copy(this._eye);
    this._rotAnchor = null;

    this.setState({
      enableCameraControl: false
    });
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

    if (state.enableCameraControl) {
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
      this.nextRotationEvent(new THREE.Vector2(
        event.pageX - offset.x,
        -(event.pageY - offset.y)
      ));
    }
  }


  startCameraControl() {
    this.setState({
      enableCameraControl: true
    });
  }


  render() {
    return (
      <canvas
        ref="canvas"
        tabIndex="-1"
        className={this.props.className}
        onMouseDown={this.startCameraControl.bind(this)}
        onMouseLeave={this.endCameraControl.bind(this)}
        onMouseUp={this.endCameraControl.bind(this)}
        onMouseMove={this.canvasOnMouseMove.bind(this)}>
      </canvas>
    );
  }
}
