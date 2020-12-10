"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs2/regenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

// import "@babel/polyfill"
var array = [1, 2, 3, 4, 5, 6];
array.includes(function (item) {
  return item > 2;
});
new _promise.default();

function a() {
  return _regenerator.default.async(function a$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(1);

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}