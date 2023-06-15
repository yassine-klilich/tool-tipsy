import "./yk-tooltip.css"

const YK_Tooltip = (function() {
  const _yk_ = {}
  
  const _positions = {
    above: "above",
    below: "below",
    left: "left",
    right: "right"
  }
  
  let _tooltipOverlayWrapper, _tooltipOverlay, _tooltip, _tooltipText

  _yk_.init = function() {
    _appendTooltipOverlayToBody();

    let tooltipTriggers = document.querySelectorAll(`[yk-tooltip]`);
    tooltipTriggers.forEach(tooltipTrigger => {
      let tooltipObject = {
        text: null,
        position: null,
        showDelay: 150,
        showDelayTimeout: null,
        hideDelay: 0, 
        hideDelayTimeout: null,
        target: tooltipTrigger
      }

      tooltipTrigger.addEventListener('mouseenter', () => _showTooltip(tooltipObject));
      tooltipTrigger.addEventListener('focus', () => _showTooltip(tooltipObject));

      tooltipTrigger.addEventListener('mouseleave', () => _hideTooltip(tooltipObject));
      tooltipTrigger.addEventListener('click', () => _hideTooltip(tooltipObject));
      tooltipTrigger.addEventListener('blur', () => _hideTooltip(tooltipObject)); 
    })
  }

  function _showTooltip(tooltipObject) {
    tooltipObject.showDelay = parseFloat(tooltipObject.target.getAttribute('yk-show-delay')) || 150;
    clearTimeout(tooltipObject.showDelayTimeout);
    clearTimeout(tooltipObject.hideDelayTimeout);
    tooltipObject.hideDelayTimeout = null;
    tooltipObject.showDelayTimeout = setTimeout(()=>{
      tooltipObject.text = tooltipObject.target.getAttribute('yk-tooltip');
      tooltipObject.position = tooltipObject.target.getAttribute('yk-position') || _positions.below;
      _tooltipText.textContent = tooltipObject.text;
  
      if(!_positions[tooltipObject.position]) {
        throw new Error(`Tooltip position '${tooltipObject.position}' is invalid`);
      }
  
      _tooltipOverlay.setAttribute('style', "top: 0px; left: 0px");
      let axis = _getBestAxisValues(tooltipObject);
      _tooltipOverlay.setAttribute('style', `top: ${axis.y}px; left: ${axis.x}px`);

      _tooltipOverlayWrapper.style.visibility = "visible";
      _tooltip.style.opacity = "1";
    }, tooltipObject.showDelay);
  }

  function _hideTooltip(tooltipObject) {
    tooltipObject.hideDelay = parseFloat(tooltipObject.target.getAttribute('yk-hide-delay')) || 0;
    clearTimeout(tooltipObject.hideDelayTimeout);
    clearTimeout(tooltipObject.showDelayTimeout);
    tooltipObject.showDelayTimeout = null;
    tooltipObject.hideDelayTimeout = setTimeout(()=>{
      _tooltipOverlayWrapper.style.visibility = "hidden";
      _tooltip.style.opacity = "0";
    }, tooltipObject.hideDelay);
  }

  function _appendTooltipOverlayToBody() {
    _tooltipOverlayWrapper = document.createElement('div');
    _tooltipOverlay = document.createElement('div');
    _tooltip = document.createElement('div');
    _tooltipText = document.createElement('div');

    _tooltipOverlayWrapper.className = 'yk-tooltip-overlay-wrapper'
    _tooltipOverlay.className = 'yk-tooltip-overlay'
    _tooltip.className = 'yk-tooltip'
    _tooltipText.className = 'yk-tooltip-text'

    _tooltip.appendChild(_tooltipText);
    _tooltipOverlay.appendChild(_tooltip);
    _tooltipOverlayWrapper.appendChild(_tooltipOverlay);
    document.body.appendChild(_tooltipOverlayWrapper);
  }

  function _getBestAxisValues(options) {
    let x = 0;
    let y = 0;
    let targetRect = options.target.getBoundingClientRect();
    let tooltipRect = _tooltipOverlay.getBoundingClientRect();
    
    x = _xAxisPosition(options.position, targetRect, tooltipRect);
    y = _yAxisPosition(options.position, targetRect, tooltipRect);
    
    return { x, y }
  }
  
  function _xAxisPosition(position, targetRect, tooltipRect) {
    let spaceFromLeft = targetRect.left;
    let scrollBarWidth = (window.innerWidth - _tooltipOverlayWrapper.getBoundingClientRect().width);
    let spaceFromRight = (window.innerWidth - scrollBarWidth) - targetRect.right;

    switch (position) {
      case _positions.left:
        if(spaceFromLeft >= tooltipRect.width) {
          return spaceFromLeft - tooltipRect.width;
        }
        else {
          if(spaceFromRight >= tooltipRect.width) {
            return targetRect.right;
          }
          else {
            if(spaceFromRight > spaceFromLeft){
              let hiddenSpace = tooltipRect.width - spaceFromRight;
              return targetRect.right - hiddenSpace;
            }
            else {
              let hiddenSpace = tooltipRect.width - spaceFromLeft;
              return spaceFromLeft - tooltipRect.width + hiddenSpace;
            }
          }
        }
        
      case _positions.right:
        if(spaceFromRight >= tooltipRect.width) {
          return targetRect.right;
        }
        else {
          if(spaceFromLeft >= tooltipRect.width) {
            return spaceFromLeft - tooltipRect.width;
          }
          else {
            if(spaceFromRight > spaceFromLeft){
              let hiddenSpace = tooltipRect.width - spaceFromRight;
              return targetRect.right - hiddenSpace;
            }
            else {
              let hiddenSpace = tooltipRect.width - spaceFromLeft;
              return spaceFromLeft - tooltipRect.width + hiddenSpace;
            }
          }
        }

      case _positions.above:
      case _positions.below:
        spaceFromLeft = targetRect.left + (targetRect.width / 2);
        let scrollBarWidth = (window.innerWidth - _tooltipOverlayWrapper.getBoundingClientRect().width);
        spaceFromRight = ((window.innerWidth - scrollBarWidth) - targetRect.right) + (targetRect.width / 2);
        let tooltipHalfWidth = (tooltipRect.width / 2);

        if(spaceFromLeft >= tooltipHalfWidth) {
          let hiddenSpaceFromRight = 0;
          if(spaceFromRight < tooltipHalfWidth){
            hiddenSpaceFromRight = tooltipHalfWidth - spaceFromRight;
          }

          let _left = spaceFromLeft - tooltipHalfWidth - hiddenSpaceFromRight;

          return (_left < 0) ? 0 : _left;
        }
        else {
          let hiddenSpace = tooltipHalfWidth - spaceFromLeft;
          return (spaceFromLeft - tooltipHalfWidth) + hiddenSpace;
        }
    }
  }

  function _yAxisPosition(position, targetRect, tooltipRect) {
    let spaceFromTop = targetRect.top;
    let scrollBarHeight = (window.innerHeight - _tooltipOverlayWrapper.getBoundingClientRect().height);
    let spaceFromBottom = (window.innerHeight - scrollBarHeight) - targetRect.bottom;

    switch (position) {
      case _positions.above:
        if(spaceFromTop >= tooltipRect.height) {
          return targetRect.top - tooltipRect.height;
        }
        else {
          if(spaceFromBottom >= tooltipRect.height){
            return targetRect.bottom;
          }
          else {
            let hiddenSpace = (tooltipRect.height - targetRect.top);
            return (targetRect.top - tooltipRect.height) + hiddenSpace;
          }
        }

      case _positions.below:
        if(spaceFromBottom >= tooltipRect.height) {
          return targetRect.bottom;
        }
        else {
          if(spaceFromTop >= tooltipRect.height){
            return targetRect.top - tooltipRect.height;
          }
          else {
            let hiddenSpace = (tooltipRect.height - targetRect.top);
            return (targetRect.top - tooltipRect.height) + hiddenSpace;
          }
        }

      case _positions.left:
      case _positions.right:
        spaceFromTop = targetRect.top + (targetRect.height / 2);
        spaceFromBottom = ((window.innerHeight - scrollBarHeight) - targetRect.bottom) + (targetRect.height / 2);
        let tooltipHalfHeight = (tooltipRect.height / 2);

        if(spaceFromTop >= tooltipHalfHeight) {
          let hiddenSpaceFromBottom = 0;
          if(spaceFromBottom < tooltipHalfHeight){
            hiddenSpaceFromBottom = tooltipHalfHeight - spaceFromBottom;
          }

          let _top = spaceFromTop - tooltipHalfHeight - hiddenSpaceFromBottom;
          
          return (_top < 0) ? 0 : _top;
        }
        else {
          let hiddenSpace = tooltipHalfHeight - spaceFromTop;
          return (spaceFromTop - tooltipHalfHeight) + hiddenSpace;
        }
    }
  }

  return _yk_
})()

export default YK_Tooltip