
import Tipsy from "./tool-tipsy.js"

Tipsy.init()

console.log(Tipsy.attach({
  target: document.getElementById("box"),
  content: "This is a BOX",
  position: "left",
}));

console.log(Tipsy);


console.log(Tipsy.detach(Tipsy.tooltips[`tipsy-0`]))
console.log(Tipsy.detach(Tipsy.tooltips[`tipsy-3`]))