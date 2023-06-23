0.3.12 / 2017-06-29
===================

  * Fallback to ms prefixed elementsFromPoint

0.3.11 / 2017-05-28
===================

  * Merge pull request [#70]
  (https://github.com/yahoo/react-dnd-touch-backend/issues/70) from egorvoronov/patch-1
    document is not defined fix for server side rendering
  * [FIXED] single quotes instead
  * [FIXED] undefined in quotes
  * [FIXED] document is not defined fix for server side rendering
  * Add CHANGELOG and version tags
  * Allows usage without global gulp install ([#66](https://github.com/yahoo/react-dnd-touch-backend/issues/66))

0.3.10 / 2017-05-11
===================

  * Check document variable with typeof
    fixes [#62](https://github.com/yahoo/react-dnd-touch-backend/issues/62)#

0.3.9 / 2017-04-25
==================

  * v++
  * Check if document is defined before checking if there is a elementsFromPoint method ([#61](https://github.com/yahoo/react-dnd-touch-backend/issues/61))

0.3.8 / 2017-04-18
==================

  * v++
  * Add polyfill for elementsFromPoint ([#59](https://github.com/yahoo/react-dnd-touch-backend/issues/59))
    - remove Object.assign from dropTarget example to prevent older IEs incompatibility

0.3.7 / 2017-04-13
==================

  * add yarnl lock file
  * v++
  * Add gzip size ([#53](https://github.com/yahoo/react-dnd-touch-backend/issues/53))
  * gulp-connect Integration ([#55](https://github.com/yahoo/react-dnd-touch-backend/issues/55))
    * Updated instructions
    * Can now serve examples via local server
    * Updated with gulp-connect
  * Ensure correct order on DropTarget drop method calling ([#57](https://github.com/yahoo/react-dnd-touch-backend/issues/57))
    * Add example for dynamic nested DropTargets
    * Ensure correct order on DropTarget drop method calling

0.3.6 / 2017-03-15
==================

  * v++
  * Stop drag from starting if context menu is opened during right click ([#52](https://github.com/yahoo/react-dnd-touch-backend/issues/52))

0.3.5 / 2016-12-21
==================

  * v++
  * Cancel drag by hitting Escape if enableKeyboardEvents option is set to true ([#48](https://github.com/yahoo/react-dnd-touch-backend/issues/48))

0.3.4 / 2016-12-18
==================

  * v++
  * fix examples ([#46](https://github.com/yahoo/react-dnd-touch-backend/issues/46))
    * fix examples
    * update readme
  * Fixes [#44](https://github.com/yahoo/react-dnd-touch-backend/issues/44) ([#45](https://github.com/yahoo/react-dnd-touch-backend/issues/45))

0.3.3 / 2016-09-16
==================

  * upgrade deps & fix lint errors
  * v++
  * (fix) drop on nested dom element will fail ([#42](https://github.com/yahoo/react-dnd-touch-backend/issues/42))

0.3.2 / 2016-08-16
==================

  * v++
  * Improving connectDropTarget ([#38](https://github.com/yahoo/react-dnd-touch-backend/issues/38))
    * Fixing issues caused by touchmove when connecting up the drop target
    * Adding return function back in
    * Adding example for drop targets and updating connectDropTarget to handle nested elements

0.3.1 / 2016-08-08
==================

  * v++
  * Fix issues surrounding 'touchmove' event listener ([#37](https://github.com/yahoo/react-dnd-touch-backend/issues/37))
    * Fixing issues caused by touchmove when connecting up the drop target
    * Adding return function back in

0.3.0 / 2016-06-30
==================

  * v0.3.0
  * the sortable list demo now correctly reorders a list when a item is moved in the same list ([#33](https://github.com/yahoo/react-dnd-touch-backend/issues/33))
  * monitor.isOver({ shallow: true }) now works according to the documentation. ([#32](https://github.com/yahoo/react-dnd-touch-backend/issues/32))

0.2.7 / 2016-04-26
==================

  * v++
  * Separated touch and mouse delay options
    Re-adding support for delay option.
  * upgrade react, remove decorator usage, add caveat to mouse event.

0.2.5 / 2016-03-21
==================

  * upgrade dev tool, v++
  * Merge pull request [#20](https://github.com/yahoo/react-dnd-touch-backend/issues/20) from cedmax/master
    added delay option
  * added delay option to enable holding the dragSource before enabling the dragging
  * Fix examples gulp task

0.2.4 / 2015-12-03
==================

  * v++
  * browserified dist

0.2.3 / 2015-12-01
==================

  * v++
  * fix lint

0.2.2 / 2015-12-01
==================

  * v++
  * Fixes crash when trying to observe null node
  * Fix mouse support example in README

0.2.1 / 2015-11-20
==================

  * v++
  * minor fixes
  * Enchance example in readme
  * Less is more
  * Update README to reflect new configuration option
  * Add support for mouse events
  * Add lodash.defaults dependency
  * fix reordering logic
  * update examples to multi list
  * update README for [#3](https://github.com/yahoo/react-dnd-touch-backend/issues/3)

0.2.0 / 2015-10-15
==================

  * react-dnd 2.0, react 0.14

0.1.1 / 2015-10-15
==================

  * fix spaces
  * v++
  * Don't use internal React DnD functions
  * add travis config
  * try config travis
  * fix viewport change
  * rm build badges
  * badges
  * fix [#1](https://github.com/yahoo/react-dnd-touch-backend/issues/1)

0.1.0 / 2015-10-05
==================

  * add prepublish step
  * add source
  * Initial commit