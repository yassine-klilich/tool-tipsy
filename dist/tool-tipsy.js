import "./tool-tipsy.css"

const Tipsy = (function() {
  const DEFAULT_SHOW_AFTER = 150
  const DEFAULT_HIDE_AFTER = 0
  const Position = Object.freeze({
    above: "above",
    below: "below",
    left: "left",
    right: "right"
  })
  let _tooltipOverlayWrapper, _tooltipOverlay, _tooltip, _tooltipText
  let timeoutId = null

  const _tipsy_ = {
    tooltips: {}
  }
  let _countTooltips = 0
  let _idTipsy = 0

  _tipsy_.Position = Object.freeze(Position)

  _tipsy_.init = function() {
    _appendOverlay()

    const tipsy = document.querySelectorAll(`[tipsy]`)
    tipsy.forEach(el => {
      const config = new ToolTipsy({
        id: `tipsy-${_idTipsy}`,
        content: el.getAttribute("tipsy") || "",
        position: el.getAttribute("tipsy-position") || Position.below,
        showAfter: el.getAttribute("tipsy-show-after") || DEFAULT_SHOW_AFTER,
        hideAfter: el.getAttribute("tipsy-hide-after") || DEFAULT_HIDE_AFTER,
        target: el
      })

      _buildTooltip(config)
    })
  }

  _tipsy_.attach = function(config) {
    if (config == null) {
      throw new Error(`Tipsy[attach]: no config is provided`)
    }
    const _config = new ToolTipsy({
      id: `tipsy-${_idTipsy}`,
      content: config.content || "",
      position: config.position || "",
      showAfter: config.showAfter || DEFAULT_SHOW_AFTER,
      hideAfter: config.hideAfter || DEFAULT_HIDE_AFTER,
      target: config.target
    })

    _buildTooltip(_config)

    config.target.setAttribute("tipsy", _config.content)
    config.target.setAttribute("tipsy-position", _config.position)
    config.target.setAttribute("tipsy-show-after", _config.showAfter)
    config.target.setAttribute("tipsy-hide-after", _config.hideAfter)

    return _config
  }

  _tipsy_.detach = function(tipsy) {
    if (tipsy) {
      tipsy.detach()
    }
  }

  function _buildTooltip(config) {
    const target = config.target
    if (target == null) {
      throw new Error(`Tipsy[_buildTooltip]: target element is not defined`)
    }

    target.addEventListener('mouseenter', _showTooltip)
    target.addEventListener('focus', _showTooltip)
    target.addEventListener('mouseleave', _hideTooltip)
    target.addEventListener('click', _hideTooltip)
    target.addEventListener('blur', _hideTooltip)
    target.setAttribute("tipsy-id", config.id)

    _tipsy_.tooltips[config.id] = config
    ++_countTooltips
    ++_idTipsy
  }

  function _showTooltip() {
    const config = _tipsy_.tooltips[this.getAttribute("tipsy-id")]
    config.showAfter = parseFloat(config.target.getAttribute('tipsy-show-after')) || DEFAULT_SHOW_AFTER
    _clearTimeout()
    _hideOverlay()
    timeoutId = setTimeout(()=>{
      config.content = config.target.getAttribute('tipsy')
      config.position = config.target.getAttribute('tipsy-position') || Position.below
      _tooltipText.textContent = config.content
  
      if(!Position[config.position]) {
        throw new Error(`Tipsy[_showTooltip]: Tooltip position '${config.position}' is invalid`)
      }

      let axis = _getBestAxisValues(config)
      _tooltipOverlay.setAttribute('style', `top: ${axis.y}px; left: ${axis.x}px`)

      _tooltipOverlayWrapper.style.visibility = "visible"
      _tooltip.style.opacity = "1"
    }, config.showAfter)
  }

  function _hideTooltip() {
    const config = _tipsy_.tooltips[this.getAttribute("tipsy-id")]
    config.hideAfter = parseFloat(config.target.getAttribute('tipsy-hide-after')) || DEFAULT_HIDE_AFTER
    _clearTimeout()
    if (config.hideAfter == 0) {
      _hideOverlay()
    }
    else {
      timeoutId = setTimeout(()=>{
        _hideOverlay()
      }, config.hideAfter)
    }
  }

  function _clearTimeout() {
    clearTimeout(timeoutId)
    timeoutId = null
  }

  function _hideOverlay() {
    _tooltipOverlayWrapper.style.visibility = "hidden"
    _tooltip.style.opacity = "0"
  }

  function _appendOverlay() {
    _tooltipOverlayWrapper = document.createElement('div')
    _tooltipOverlay = document.createElement('div')
    _tooltip = document.createElement('div')
    _tooltipText = document.createElement('div')

    _tooltipOverlayWrapper.className = 'tipsy-overlay-wrapper'
    _tooltipOverlay.className = 'tipsy-overlay'
    _tooltip.className = 'tipsy-tooltip'
    _tooltipText.className = 'tipsy-tooltip-text'

    _tooltip.appendChild(_tooltipText)
    _tooltipOverlay.appendChild(_tooltip)
    _tooltipOverlayWrapper.appendChild(_tooltipOverlay)
    document.body.appendChild(_tooltipOverlayWrapper)
  }

  function _getBestAxisValues(config) {
    let x = 0
    let y = 0
    let targetRect = config.target.getBoundingClientRect()
    let tooltipRect = _tooltipOverlay.getBoundingClientRect()
    
    x = _xAxisPosition(config.position, targetRect, tooltipRect)
    y = _yAxisPosition(config.position, targetRect, tooltipRect)
    
    return { x, y }
  }
  
  function _xAxisPosition(position, targetRect, tooltipRect) {
    let spaceFromLeft = targetRect.left
    let scrollBarWidth = (window.innerWidth - _tooltipOverlayWrapper.getBoundingClientRect().width)
    let spaceFromRight = (window.innerWidth - scrollBarWidth) - targetRect.right

    switch (position) {
      case Position.left:
        if(spaceFromLeft >= tooltipRect.width) {
          return spaceFromLeft - tooltipRect.width
        }
        else {
          if(spaceFromRight >= tooltipRect.width) {
            return targetRect.right
          }
          else {
            if(spaceFromRight > spaceFromLeft){
              let hiddenSpace = tooltipRect.width - spaceFromRight
              return targetRect.right - hiddenSpace
            }
            else {
              let hiddenSpace = tooltipRect.width - spaceFromLeft
              return spaceFromLeft - tooltipRect.width + hiddenSpace
            }
          }
        }
        
      case Position.right:
        if(spaceFromRight >= tooltipRect.width) {
          return targetRect.right
        }
        else {
          if(spaceFromLeft >= tooltipRect.width) {
            return spaceFromLeft - tooltipRect.width
          }
          else {
            if(spaceFromRight > spaceFromLeft){
              let hiddenSpace = tooltipRect.width - spaceFromRight
              return targetRect.right - hiddenSpace
            }
            else {
              let hiddenSpace = tooltipRect.width - spaceFromLeft
              return spaceFromLeft - tooltipRect.width + hiddenSpace
            }
          }
        }

      case Position.above:
      case Position.below:
        spaceFromLeft = targetRect.left + (targetRect.width / 2)
        let scrollBarWidth = (window.innerWidth - _tooltipOverlayWrapper.getBoundingClientRect().width)
        spaceFromRight = ((window.innerWidth - scrollBarWidth) - targetRect.right) + (targetRect.width / 2)
        let tooltipHalfWidth = (tooltipRect.width / 2)

        if(spaceFromLeft >= tooltipHalfWidth) {
          let hiddenSpaceFromRight = 0
          if(spaceFromRight < tooltipHalfWidth){
            hiddenSpaceFromRight = tooltipHalfWidth - spaceFromRight
          }

          let _left = spaceFromLeft - tooltipHalfWidth - hiddenSpaceFromRight

          return (_left < 0) ? 0 : _left
        }
        else {
          let hiddenSpace = tooltipHalfWidth - spaceFromLeft
          return (spaceFromLeft - tooltipHalfWidth) + hiddenSpace
        }
    }
  }

  function _yAxisPosition(position, targetRect, tooltipRect) {
    let spaceFromTop = targetRect.top
    let scrollBarHeight = (window.innerHeight - _tooltipOverlayWrapper.getBoundingClientRect().height)
    let spaceFromBottom = (window.innerHeight - scrollBarHeight) - targetRect.bottom

    switch (position) {
      case Position.above:
        if(spaceFromTop >= tooltipRect.height) {
          return targetRect.top - tooltipRect.height
        }
        else {
          if(spaceFromBottom >= tooltipRect.height){
            return targetRect.bottom
          }
          else {
            let hiddenSpace = (tooltipRect.height - targetRect.top)
            return (targetRect.top - tooltipRect.height) + hiddenSpace
          }
        }

      case Position.below:
        if(spaceFromBottom >= tooltipRect.height) {
          return targetRect.bottom
        }
        else {
          if(spaceFromTop >= tooltipRect.height){
            return targetRect.top - tooltipRect.height
          }
          else {
            let hiddenSpace = (tooltipRect.height - targetRect.top)
            return (targetRect.top - tooltipRect.height) + hiddenSpace
          }
        }

      case Position.left:
      case Position.right:
        spaceFromTop = targetRect.top + (targetRect.height / 2)
        spaceFromBottom = ((window.innerHeight - scrollBarHeight) - targetRect.bottom) + (targetRect.height / 2)
        let tooltipHalfHeight = (tooltipRect.height / 2)

        if(spaceFromTop >= tooltipHalfHeight) {
          let hiddenSpaceFromBottom = 0
          if(spaceFromBottom < tooltipHalfHeight){
            hiddenSpaceFromBottom = tooltipHalfHeight - spaceFromBottom
          }

          let _top = spaceFromTop - tooltipHalfHeight - hiddenSpaceFromBottom
          
          return (_top < 0) ? 0 : _top
        }
        else {
          let hiddenSpace = tooltipHalfHeight - spaceFromTop
          return (spaceFromTop - tooltipHalfHeight) + hiddenSpace
        }
    }
  }

  function ToolTipsy(config) {
    this.id = config.id
    this.content = config.content
    this.position = config.position
    this.showAfter = config.showAfter
    this.hideAfter = config.hideAfter
    this.target = config.target
  }

  ToolTipsy.prototype.detach = function() {
    this.target.removeEventListener('mouseenter', _showTooltip)
    this.target.removeEventListener('focus', _showTooltip)
    this.target.removeEventListener('mouseleave', _hideTooltip)
    this.target.removeEventListener('click', _hideTooltip)
    this.target.removeEventListener('blur', _hideTooltip)
    delete Tipsy.tooltips[this.id]
    --_countTooltips
  }

  return _tipsy_
})()

export default Tipsy