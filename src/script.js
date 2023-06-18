
import Tipsy, { TipsyPosition } from "./tool-tipsy.js"

Tipsy.init()

console.log(Tipsy.attach({
  target: document.getElementById("box"),
  content: "This is a BOX",
  position: "left",
  showAfter: 0
}));

console.log(Tipsy);
console.log(Tipsy.getLength());


// console.log(Tipsy.detach(Tipsy.tooltips[`tipsy-0`]))
// console.log(Tipsy.detach(Tipsy.tooltips[`tipsy-3`]))
// console.log(Tipsy.getLength());

Tipsy.tooltips[`tipsy-1`].position = TipsyPosition.below
Tipsy.tooltips[`tipsy-1`].showAfter = 200