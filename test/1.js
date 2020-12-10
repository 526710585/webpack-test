"use strict";

require("regenerator-runtime/runtime");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es7.array.includes");

var array = [1, 2, 3, 4, 5, 6];
array.includes(function (item) {
  return item > 2;
});
new Promise();

function a() {
  return regeneratorRuntime.async(function a$(_context) {
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