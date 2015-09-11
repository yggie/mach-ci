'use strict';

import React from 'react';

window.context = describe;

window.specs = (function () {
  let specs = {};

  specs.render = function (component) {
    let renderer = React.addons.TestUtils.createRenderer();
    renderer.render(component);

    return renderer.getRenderOutput();
  };

  specs.renderToString = function (component) {
    return React.renderToStaticMarkup(component);
  };

  return specs;
}).call(this);
