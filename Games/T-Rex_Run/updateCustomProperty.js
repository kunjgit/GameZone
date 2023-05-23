/**
 * Retrieves the value of a custom CSS property on a given element.
 * @param {Element} elem - The element to retrieve the custom property from.
 * @param {string} prop - The name of the custom property to retrieve.
 * @returns {number} - The value of the custom property as a number, or 0 if it is not set.
 */
export function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
  }
  
  export function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value)
  }
  
  export function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc)
  }