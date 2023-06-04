let Utils = (function () {
    "use strict";

    return {
        /**
         * Returns a random value between from and to
         * @param {number} from
         * @param {number} to
         * @return {number}
         */
        rand(from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        },
        
        /**
         * Returns the value higher than the min and lower than the max
         * @param {number} value
         * @param {number} min
         * @param {number} max
         * @return {number}
         */
        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },
    
        /**
         * Adds the separator every 3 decimals
         * @param {number} number
         * @param {string} separator
         * @return {string}
         */
        formatNumber(number, separator) {
            let result = "", count = 0, char;
            number = String(number);
            
            for (let i = number.length - 1; i >= 0; i -= 1) {
                char   = number.charAt(i);
                count += 1;
                result = char + result;
                
                if (count === 3 && i > 0) {
                    result = separator + result;
                    count  = 0;
                }
            }
            return result;
        },
        
        /**
         * Returns the angle between two values
         * @param {number} x
         * @param {number} y
         * @return {number}
         */
        calcAngle(x, y) {
            let angle = Math.round(Math.abs(Math.atan(y / x) * 180 / Math.PI));
            if (y < 0 && x >= 0) {
                angle = 360 - angle;
            } else if (y < 0 && x < 0) {
                angle = 180 + angle;
            } else if (y >= 0 && x < 0) {
                angle = 180 - angle;
            }
            return angle;
        },
        
        
        /**
         * Returns the closest element with an action
         * @param {Event}
         * @return {DOMElement}
         */
        getTarget(event) {
            let element = event.target;
            while (element.parentElement && !element.dataset.action) {
                element = element.parentElement;
            }
            return element;
        },
        
        /**
         * Returns the position of an Element in the document
         * @param {DOMElement} element
         * @return {{top: number, left: number}}
         */
        getPosition(element) {
            let top = 0, left = 0;
            if (element.offsetParent !== undefined) {
                top  = element.offsetTop;
                left = element.offsetLeft;
                
                while (element.offsetParent && typeof element.offsetParent === "object") {
                    element = element.offsetParent;
                    top  += element.offsetTop;
                    left += element.offsetLeft;
                }
            } else if (element.x !== undefined) {
                top  = element.y;
                left = element.x;
            }
            return { top, left };
        },
        
        /**
         * Sets the position of the given element or elements
         * @param {DOMElement} element
         * @param {number} top
         * @param {number} lefet
         */
        setPosition(element, top, left) {
            element.style.top  = top  + "px";
            element.style.left = left + "px";
        },
        
        /**
         * Removes the Element from the DOM
         * @param {DOMElement} element
         */
        removeElement(element) {
            var parent = element.parentNode;
            parent.removeChild(element);
        },
    
    
        /**
         * Returns the Mouse Position
         * @param {Event} event
         * @return {{top: number, left: number}}
         */
        getMousePos(event) {
            let top = 0, left = 0;
            if (!event) {
                event = window.event;
            }
            if (event.pageX) {
                top  = event.pageY;
                left = event.pageX;
            } else if (event.clientX) {
                top  = event.clientY + (document.documentElement.scrollTop  || document.body.scrollTop);
                left = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            }
            return { top, left };
        },
    
        /**
         * Unselects the elements
         */
        unselect() {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
        }
    };
}());
