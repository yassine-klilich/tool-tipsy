
import ToolTipsy from "./tool-tipsy.js"

ToolTipsy.init()

ToolTipsy.attach({
  target: document.getElementById("box"),
  content: "This is a BOX",
  position: "left",
})

console.log(ToolTipsy);
