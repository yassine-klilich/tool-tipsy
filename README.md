# Tool-Tipsy

Tool-Tipsy is a lightweight tooltip library.

# Installation

```
npm install tool-tipsy
```

# How to use

- tool-tipsy consists of 4 attributes:
```html
<button
  tipsy="Hello Universe!"
  tipsy-position="above"
  tipsy-show-after="200"
  tipsy-hide-after="400"
>Click me</button>
```

Attribute              | Value                         
-----------------------|-------------------------------
tipsy                  | text content
tipsy-position         | above, below, left or right
tipsy-show-after       | milliseconds
tipsy-hide-after       | milliseconds

- And in your JS file import the library and call init function to inilitialize your tooltips that has been defined in HTML.
```javascript
import Tipsy from "tool-tipsy"

Tipsy.init()
```
- OR you can attach tooltip using:
```javascript
// attach function creates and returns the created tooltip object ToolTipsy.
let tipsyObj = Tipsy.attach({
  target: document.getElementById("box"),
  content: "This is a BOX",
  position: "left",
  showAfter: 150,
  hideAfter: 0
})
```

# Properties
## tooltips
- Key/Value pairs of all created 
```javascript
console.log(Tipsy.tooltips)
```

# Methods
## detach()
```javascript
Tipsy.tooltips['tipsy-0'].detach()
```
- OR you can use
```javascript
Tipsy.detach(Tipsy.tooltips['tipsy-0'])
```

## getLength()
- Get length of created tooltips
```javascript
Tipsy.getLength()
```

## Change config of a tooltip
```javascript
Tipsy.tooltips['tipsy-0'].position = TipsyPosition.below
Tipsy.tooltips['tipsy-0'].hideAfter = 800
```

# References
- Tooltip positions
```javascript
TipsyPosition.above
TipsyPosition.below
TipsyPosition.left
TipsyPosition.right
```

# License

Licensed under the [ISC License](/LICENSE).