'use strict';

export default class Contact {
  constructor(center, normal) {
    this._center = center;
    this._normal = normal;
  }

  center() {
    return this._center;
  }

  normal() {
    return this._normal;
  }
}
