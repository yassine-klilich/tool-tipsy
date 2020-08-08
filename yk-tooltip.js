
(function(window) {
  if(!window.YK_Tooltip){
    window.YK_Tooltip = {
      _selector: 'yk-tooltip',
    
      _showDelay: 150,
      _hideDelay: 0,
    
      _positions: {
        above: "above",
        below: "below",
        left: "left",
        right: "right"
      },
    
      _attrOptions: {
        text: 'yk-tooltip',
        position: 'yk-position',
        showDelay: 'yk-show-delay',
        hideDelay: 'yk-hide-delay'
      },
    
      _classNames: {
        tooltipOverlayWrapper: 'yk-tooltip-overlay-wrapper',
        tooltipOverlay: 'yk-tooltip-overlay',
        tooltip: 'yk-tooltip',
        tooltipText: 'yk-tooltip-text'
      },
    
      _tooltipOverlayWrapper: null,
      _tooltipOverlay: null,
      _tooltip: null,
      _tooltipText: null,
    
      init: function() {
        this._appendTooltipOverlayToBody();
    
        let tooltipTriggers = document.querySelectorAll(`[${this._selector}]`);
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
    
          tooltipTrigger.addEventListener('mouseenter', () => this._showTooltip(tooltipObject));
          tooltipTrigger.addEventListener('focus', () => this._showTooltip(tooltipObject));
    
          tooltipTrigger.addEventListener('mouseleave', () => this._hideTooltip(tooltipObject));
          tooltipTrigger.addEventListener('click', () => this._hideTooltip(tooltipObject));
          tooltipTrigger.addEventListener('blur', () => this._hideTooltip(tooltipObject));
        })
      },
      
      _showTooltip: function(tooltipObject) {
        tooltipObject.showDelay = parseFloat(tooltipObject.target.getAttribute(YK_Tooltip._attrOptions.showDelay)) || YK_Tooltip._showDelay;
    
        tooltipObject.showDelayTimeout = setTimeout(()=>{
          clearTimeout(tooltipObject.hideDelayTimeout);
          tooltipObject.text = tooltipObject.target.getAttribute(YK_Tooltip._attrOptions.text);
          tooltipObject.position = tooltipObject.target.getAttribute(YK_Tooltip._attrOptions.position) || YK_Tooltip._positions.below;
          YK_Tooltip._tooltipText.textContent = tooltipObject.text;
      
          if(!YK_Tooltip._positions[tooltipObject.position]) {
            throw new Error(`Tooltip position '${tooltipObject.position}' is invalid`);
          }
      
          YK_Tooltip._tooltipOverlay.setAttribute('style', "top: 0px; left: 0px");
          let axis = YK_Tooltip._getBestAxisValues(tooltipObject.target, tooltipObject.position);
          YK_Tooltip._tooltipOverlay.setAttribute('style', `top: ${axis.y}px; left: ${axis.x}px`);

          YK_Tooltip._tooltipOverlayWrapper.style.visibility = "visible";
          YK_Tooltip._tooltip.style.opacity = "1";
        }, tooltipObject.showDelay);
      },
    
      _hideTooltip: function(tooltipObject) {
        tooltipObject.hideDelay = parseFloat(tooltipObject.target.getAttribute(YK_Tooltip._attrOptions.hideDelay)) || YK_Tooltip._hideDelay;
    
        tooltipObject.hideDelayTimeout = setTimeout(()=>{
          clearTimeout(tooltipObject.showDelayTimeout);
          tooltipObject.showDelayTimeout = null;
          YK_Tooltip._tooltipOverlayWrapper.style.visibility = "hidden";
          YK_Tooltip._tooltip.style.opacity = "0";
        }, tooltipObject.hideDelay);
      },
    
      _appendTooltipOverlayToBody: function() {
        this._tooltipOverlayWrapper = document.createElement('div');
        this._tooltipOverlay = document.createElement('div');
        this._tooltip = document.createElement('div');
        this._tooltipText = document.createElement('div');
    
        this._tooltipOverlayWrapper.className = this._classNames.tooltipOverlayWrapper;
        this._tooltipOverlay.className = this._classNames.tooltipOverlay;
        this._tooltip.className = this._classNames.tooltip;
        this._tooltipText.className = this._classNames.tooltipText;
    
        this._tooltip.appendChild(this._tooltipText);
        this._tooltipOverlay.appendChild(this._tooltip);
        this._tooltipOverlayWrapper.appendChild(this._tooltipOverlay);
        document.body.appendChild(this._tooltipOverlayWrapper);
      },
    
      /**
       * 
       * @param {HTMLElement} target 
       * @param {string} position 
       */
      _getBestAxisValues: function(target, position) {
        let x = 0;
        let y = 0;
        let targetRect = target.getBoundingClientRect();
        let tooltipRect = this._tooltipOverlay.getBoundingClientRect();
        
        x = this._xAxisPosition(position, targetRect, tooltipRect);
        y = this._yAxisPosition(position, targetRect, tooltipRect);
        
        return { x, y }
      },
      
      /**
       * 
       * @param {string} position 
       * @param {ClientRect} targetRect 
       * @param {ClientRect} tooltipRect 
       */
      _xAxisPosition: function(position, targetRect, tooltipRect) {
        let spaceFromLeft = targetRect.left;
        let scrollBarWidth = (window.innerWidth - this._tooltipOverlayWrapper.getBoundingClientRect().width);
        let spaceFromRight = (window.innerWidth - scrollBarWidth) - targetRect.right;
    
        switch (position) {
          case this._positions.left:
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
            
          case this._positions.right:
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
    
          case this._positions.above:
          case this._positions.below:
            spaceFromLeft = targetRect.left + (targetRect.width / 2);
            let scrollBarWidth = (window.innerWidth - this._tooltipOverlayWrapper.getBoundingClientRect().width);
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
      },
    
      /**
       * 
       * @param {string} position 
       * @param {ClientRect} targetRect 
       * @param {ClientRect} tooltipRect 
       */
      _yAxisPosition: function(position, targetRect, tooltipRect) {
        let spaceFromTop = targetRect.top;
        let scrollBarHeight = (window.innerHeight - this._tooltipOverlayWrapper.getBoundingClientRect().height);
        let spaceFromBottom = (window.innerHeight - scrollBarHeight) - targetRect.bottom;
    
        switch (position) {
          case this._positions.above:
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
    
          case this._positions.below:
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
    
          case this._positions.left:
          case this._positions.right:
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
    };
  }
})(window);