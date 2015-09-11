'use strict';

let availableColors = [
  0xcc0033,
  0x0033cc,
  0x00cc33,
  0x990099,
  0x009999,
  0x990099
];

export default class ColorGenerator {
  constructor() {
    this._pointer = 0;
  }

  next() {
    let color = availableColors[this._pointer];
    this._pointer = (this._pointer + 1) % availableColors.length;

    return color;
  }
}
