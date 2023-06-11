
function mkEl(tag, attrs={}) {
  let el = (tag instanceof Element) ? tag : document.createElement(tag)

  mkEl.extend(el)

  Object.keys(attrs).forEach((att)=>
    att === 'text'
    ? el.appendChild(document.createTextNode(attrs[att]))
    : att === 'parent'
    ? attrs.parent.appendChild(el)
    : att === 'child'
    ? attrs.child.forEach((tag, i)=> {
      if (i%2 === 0) el.mkChild(tag, attrs.child[i+1]||{})
    })
    : att === 'css'
    ? el.setStyle(attrs.css)
    : att.match(/^on/)
    ? el[att] = attrs[att]
    : el.setAttribute(att, attrs[att])
  )

  return el
}

mkEl.extend = function extendElement(el) {
  el.mkChild = (tag, attrs)=> mkEl(tag, { ...attrs, parent: el })
  el.setStyle = (style)=> Object.entries(style).forEach(([key, val])=> el.style[key] = val )
  return el
}

window.mkEl = mkEl
