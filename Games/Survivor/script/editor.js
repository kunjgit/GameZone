/** @license
 *
 * SURVIVOR: A HTML + CSS + JavaScript prototype
 * based on the Commodore 64 version of Survivor from 1983
 * -------------------------------------------------------
 * http://schillmania.com/survivor/
 * http://www.flickr.com/photos/schill/sets/72157628885315581/
 * http://github.com/scottschiller/
 *
 * Scott Schiller wrote this beginning in December 2011, on a plane to Hawaii.
 * Code provided under the Attribution-NonCommercial 3.0 Unported (CC BY-NC 3.0) License:
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 */

// Side note, 2012.02.27: holy crap, this is nowhere near pleasing the JSLINT gods yet.

(function() {

  // common bits

  function isChildOf(node, containerNode) {

    while (node && containerNode && node.parentNode && node.parentNode !== containerNode) {

      node = node.parentNode;

    }

    return (node && node.parentNode && node.parentNode === containerNode);

  }

  var utils;

  utils = {

    css: (function() {

      function hasClass(o, cStr) {

        return (typeof(o.className)!=='undefined'?new RegExp('(^|\\s)'+cStr+'(\\s|$)').test(o.className):false);

      }

      function addClass(o, cStr) {

        if (!o || !cStr || hasClass(o,cStr)) {
          return false; // safety net
        }
        o.className = (o.className?o.className+' ':'')+cStr;

      }

      function removeClass(o, cStr) {

        if (!o || !cStr || !hasClass(o,cStr)) {
          return false;
        }
        o.className = o.className.replace(new RegExp('( '+cStr+')|('+cStr+')','g'),'');

      }

      function swapClass(o, cStr1, cStr2) {

        var tmpClass = {
          className: o.className
        };

        removeClass(tmpClass, cStr1);
        addClass(tmpClass, cStr2);

        o.className = tmpClass.className;

      }

      function toggleClass(o, cStr) {

        (hasClass(o, cStr)?removeClass:addClass)(o, cStr);

      }

      return {
        has: hasClass,
        add: addClass,
        remove: removeClass,
        swap: swapClass,
        toggle: toggleClass
      };

    }()),

    dom: (function() {

       function findXY(obj) {

         var curleft = 0,
             curtop = 0;
         do {
           curleft += obj.offsetLeft;
           curtop += obj.offsetTop;
         } while (!!(obj = obj.offsetParent));

         return [curleft,curtop];

       }

       return {
         findXY: findXY
       };

    }()),

    events: (function() {

      var add, remove, preventDefault;

      add = (typeof window.addEventListener !== 'undefined' ? function(o, evtName, evtHandler) {
        return o.addEventListener(evtName,evtHandler,false);
      } : function(o, evtName, evtHandler) {
        o.attachEvent('on'+evtName,evtHandler);
      });

      remove = (typeof window.removeEventListener !== 'undefined' ? function(o, evtName, evtHandler) {
        return o.removeEventListener(evtName,evtHandler,false);
      } : function(o, evtName, evtHandler) {
        return o.detachEvent('on'+evtName,evtHandler);
      });

      preventDefault = function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
          e.cancelBubble = true;
        }
      };

      return {
        add: add,
        preventDefault: preventDefault,
        remove: remove
      };

    }())

  };

  var screen;

  function Screen() {

    var data, events;

    data = {

      coords: {
        x: 0,
        y: 0,
        lastX: null,
        lastY: null,
        width: 0,
        height: 0,
        scrollX: 0,
        scrollY: 0
      }

    };

    events = {

      resize: function() {

        // note additional ORed legacy browser (IE 8, etc.) checks
        data.coords.width = window.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth);
        data.coords.height = window.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight);

      },

      scroll: function() {

        data.coords.scrollX = window.scrollX || document.body.scrollLeft;
        data.coords.scrollY = window.scrollY || document.body.scrollTop;

      }

    };

    function attachEvents() {

      utils.events.add(window, 'resize', events.resize);
      utils.events.add(window, 'scroll', events.scroll);

    }

    function init() {

      attachEvents();

      events.resize();

      events.scroll();

    }

    return {

      data: data,
      init: init

    };

  }

  // non-shared stuff

  var editor;

  var NODE_WIDTH = 32;
  var NODE_HEIGHT = 32;

  // minimum map sizes
  var WORLD_COLS_MIN = 42;
  var WORLD_ROWS_MIN = 42;

  // assume defaults
  var WORLD_COLS = WORLD_COLS_MIN;
  var WORLD_ROWS = WORLD_ROWS_MIN;

  // reserved map characters
  var MAP_FREE_SPACE_CHAR = ' ';
  var MAP_ALT_FREE_SPACE_CHAR = '_';
  var MAP_INSIDE_BASE_CHAR = '·';
  var MAP_INSIDE_WALLS_CHAR = '.';

  // special characters that don't map to items (see above)
  var reservedCharacters = {
    '_': true, // escape-safe space character substitute
    ' ': true,
    '·': true,
    '.': true
  };

  var dom = {
    editor: null
  };

  function xyToRowCol(x, y) {

    return {
      col: Math.min(WORLD_COLS-1, Math.max(0, Math.floor(x/NODE_WIDTH))),
      row: Math.min(WORLD_ROWS-1, Math.max(0, Math.floor(y/NODE_HEIGHT)))
    };

  }

  // duplicated from survivor.js, and 0-3 added for block types

  var charToTypeMap = {

    // blocks
    '0': ['type-0', 'block'],
    '1': ['type-1', 'block'],
    '2': ['type-2', 'block'],
    '3': ['type-3', 'block'],

    // type 1
    '┌': ['type-1', 'wall', 'upRight'],
    '┐': ['type-1', 'wall', 'rightDown'],
    '└': ['type-1', 'wall', 'downRight'],
    '┘': ['type-1', 'wall', 'downLeft'],
    '-': ['type-1', 'wall', 'horizontal'], // regular dash - used here to avoid conflict
    '|': ['type-1', 'wall', 'vertical'], // regular pipe character
    '┴': ['type-1', 'turret', 'up'],
    '├': ['type-1', 'turret', 'right'],
    '┬': ['type-1', 'turret', 'down'],
    '┤': ['type-1', 'turret', 'left'],

    // type 2
    '╔': ['type-2', 'wall', 'upRight'],
    '╗': ['type-2', 'wall', 'rightDown'],
    '╚': ['type-2', 'wall', 'downRight'],
    '╝': ['type-2', 'wall', 'downLeft'],
    '═': ['type-2', 'wall', 'horizontal'],
    '│': ['type-2', 'wall', 'vertical'], // not sure why ║ conflicted with type 4, but eh.
    '╩': ['type-2', 'turret', 'up'],
    '╠': ['type-2', 'turret', 'right'],
    '╦': ['type-2', 'turret', 'down'],
    '╣': ['type-2', 'turret', 'left'],

    // type 3
    '┏': ['type-3', 'wall', 'upRight'],
    '┓': ['type-3', 'wall', 'rightDown'],
    '┗': ['type-3', 'wall', 'downRight'],
    '┛': ['type-3', 'wall', 'downLeft'],
    '━': ['type-3', 'wall', 'horizontal'],
    '┃': ['type-3', 'wall', 'vertical'],
    '┻': ['type-3', 'turret', 'up'],
    '┣': ['type-3', 'turret', 'right'],
    '┳': ['type-3', 'turret', 'down'],
    '┫': ['type-3', 'turret', 'left'],

    // type 4
    '╓': ['type-4', 'wall', 'upRight'],
    '╖': ['type-4', 'wall', 'rightDown'],
    '╙': ['type-4', 'wall', 'downRight'],
    '╜': ['type-4', 'wall', 'downLeft'],
    '─': ['type-4', 'wall', 'horizontal'],
    '║': ['type-4', 'wall', 'vertical'],
    '╨': ['type-4', 'turret', 'up'],
    '╟': ['type-4', 'turret', 'right'],
    '╥': ['type-4', 'turret', 'down'],
    '╢': ['type-4', 'turret', 'left']

  }

  // reverse-lookup of the above (for generating map character sequences)

  var typeToCharMap = {

    'type-0': {
      // special-case: block only
      'block': 0
    },

    'type-1': {

      'block': 1,

      'wall': {
        'upRight': '┌',
        'rightDown': '┐',
        'downRight': '└',
        'downLeft': '┘',
        'horizontal': '-',
        'vertical': '|'
      },

      'turret': {
        'up': '┴',
        'right': '├',
        'down': '┬',
        'left': '┤'
      }

    },

    'type-2': {

      'block': 2,

      'wall': {
        'upRight': '╔',
        'rightDown': '╗',
        'downRight': '╚',
        'downLeft': '╝',
        'horizontal': '═',
        'vertical': '│'
      },

      'turret': {
        'up': '╩',
        'right': '╠',
        'down': '╦',
        'left': '╣'
      }

    },

    'type-3': {

      'block': 3,

      'wall': {
        'upRight': '┏',
        'rightDown': '┓',
        'downRight': '┗',
        'downLeft': '┛',
        'horizontal': '━',
        'vertical': '┃'
      },

      'turret': {
        'up': '┻',
        'right': '┣',
        'down': '┳',
        'left': '┫'
      }

    },

    'type-4': {

      // 'block': 4,

      'wall': {
        'upRight': '╓',
        'rightDown': '╖',
        'downRight': '╙',
        'downLeft': '╜',
        'horizontal': '─',
        'vertical': '║'
      },

      'turret': {
        'up': '╨',
        'right': '╟',
        'down': '╥',
        'left': '╢'
      }

    }

  }

  function Cursor(oContainer) {

    var o;

    var data = {

      active: false,
      row: 0,
      col: 0

    }

    var css = {
      'active': 'active'
    }

    function moveToXY(x, y) {

      var position = xyToRowCol(x, y);

      moveTo(position.col, position.row);

    }

    function moveTo(col, row) {

      if (col !== data.col || row !== data.row) {
        setPosition(col * NODE_WIDTH, row * NODE_HEIGHT);
      }

    }

    function selectItem(className) {

      if (o) {
        o.className = className + (data.active ? ' ' + css.active : '');
      }

    }

    function setPosition(x, y) {

      if (o && !isNaN(x) && !isNaN(y)) {
        o.style.left = (x+1) + 'px';
        o.style.top = (y+1) + 'px';
      }

    }

    function setActive(isActive) {

      if (!data.active && isActive) {

        data.active = true;
        if (o) {
          utils.css.add(o, css.active);
        }

      } else if (data.active && !isActive) {

        data.active = false;
        if (o) {
          utils.css.remove(o, css.active);
        }

      }

    }

    function init() {

      o = document.createElement('div');
      o.id = 'editor-cursor';

     oContainer.appendChild(o);

    }

    return {

      init: init,
      moveToXY: moveToXY,
      setActive: setActive,
      selectItem: selectItem

    }

  }

  editor = (function Editor() {

    var oContainer;

    var data = {
      map: [],
      mapString: [],
      isPainting: false,
      isDragging: false,
      isDeleting: false,
      selectedClass: null,
      lastAnchor: {
       row: 0,
       col: 0
      },
      lastDirection: {
        up: false,
        right: false,
        down: false,
        left: false
      },
      lastPosition: {
        col: 0,
        row: 0
      },
      mouse: {
        lastX: 0,
        lastY: 0,
        x: 0,
        y: 0
      }
    }

    var events;

    var objects;

    objects = {
      cursor: null,
      screen: null
    }

    var keyDirections = {
      // for keyboard navigation, moving through positions
      block: [],
      turret: ['up', 'right', 'down', 'left'],
      wall: ['leftDown', 'horizontal', 'rightDown', 'downRight', 'downLeft', 'vertical']
    }

    function getNextDirection(class1, class2) {

      // cycle through directional arrays based on key press counter, and return class

      var result;

      if (data.selectedClass && data.selectedClass.split(' ').length === 2) {
        // block etc., no direction
        return [class1, class2];
      }

      if (keyPressCount >= keyDirections[class2].length) {
        keyPressCount = 0;
      }

      result = [class1, class2, keyDirections[class2][keyPressCount]].join(' ');

      keyPressCount++;

      return result;

    }

    var keyPressCount = 0;
    var lastKey;

    function resetKeyCount(key) {

      // reset count when a different key is pressed
      if (key !== lastKey) {
        keyPressCount = 0;
        lastKey = key;
      }

    }

    var keys = {

      '46': function() {
        // delete
        selectItem('block delete');
      },

      // blocks

      '49': function() {
        // 1
        selectItem('type-0 block');
      },

      '50': function() {
        // 2
        selectItem('type-1 block');
      },

      '51': function() {
        // 3
        selectItem('type-2 block');
      },

      '52': function() {
        // 4
        selectItem('type-3 block');
      },

      // wall types

      '90': function() {
        // z
        var className = getNextDirection('type-1', 'wall');
        selectItem(className);
      },

      '88': function() {
        // x
        var className = getNextDirection('type-2', 'wall');
        selectItem(className);
      },

      '67': function() {
        // c
        var className = getNextDirection('type-3', 'wall');
        selectItem(className);
      },

      '86': function() {
        // v
        var className = getNextDirection('type-4', 'wall');
        selectItem(className);
      },

      // turret

      '84': function() {
        // t (turret)
        var className = getNextDirection('type-1', 'turret');
        selectItem(className);
      },

      // turret directions

      '65': function() {
        // a (left)
        selectItem('type-1 turret left');
      },

      '66': function() {
        // b
        var className = getNextDirection('type-1', 'wall');
        selectItem(className);
      },

      '68': function() {
        // d (right)
        selectItem('type-1 turret right');
      },

      '83': function() {
        // s (down)
        selectItem('type-1 turret down');
      },

      '87': function() {
        // w (up)
        selectItem('type-1 turret up');
      }

    }

    function selectItem(className) {

      data.selectedClass = className;

      // assign to the cursor, also
      objects.cursor.selectItem(className);

    }

    function resetLastPosition() {

      data.lastPosition = {
        col: null,
        row: null
      }

    }

    function resetLastDirection() {

        data.lastDirection = [];

    }

    function addDirection(newDirection) {

      data.lastDirection.push(newDirection);

      if (data.lastDirection.length > 2) {
        // take the oldest off the array
        data.lastDirection.shift();
      }

    }

    function setAnchor(location) {

      // track the anchor point, for drawing ranges
      data.lastAnchor = {
        row: location.row,
        col: location.col
      }

    }

    function beginPaint() {

      if (!data.isPainting) {

        data.isPainting = true;

        objects.cursor.setActive(true);

      }

    }

    function endPaint() {

      if (data.isPainting) {

        data.isPainting = false;

      }

    }

    function paintItemAtXY(x, y) {

      var char;
      var joinChar;
      var joinClass;
      var classTypes;
      var lastItem;
      var lastClass;
      var position = xyToRowCol(x, y);
      var row;
      var col;
      var latestDirection;

      var labelToDirectionMap = {
        'up': 'vertical',
        'down': 'vertical',
        'left': 'horizontal',
        'right': 'horizontal'
      }

      var correctDirectionMap = {
        // editor may generate these directions, but map them to the proper CSS and map characters.
        'leftDown': 'upRight',
        'upLeft': 'rightDown',
        'rightUp': 'downLeft',
        'leftUp': 'downRight'
      }

      col = position.col;
      row = position.row;

      if (data.isDeleting || (data.selectedClass && data.selectedClass.match(/delete/i))) {

        deleteAtPosition(col, row);
        return false;

      }

      // if data is undefined or different from the current item, draw there

      if (!data.selectedClass) {

        console.log('nothing selected');
        return false;

      }

      // determine character to use for map, based on className

      classTypes = data.selectedClass.split(' ');

      if (classTypes.length === 3) {

        // eg., type-3 wall upRight

        // if last direction known, attempt to intelligently guess what direction we're going in.
        if (classTypes[1] === 'wall' && data.lastPosition.col !== null && data.lastPosition.row !== null && (data.lastPosition.col !== col || data.lastPosition.row !== row)) {

          // determine our direction.
          if (row < data.lastPosition.row) {
            addDirection('up');
          } else if (col > data.lastPosition.col) {
            addDirection('right');
          } else if (row > data.lastPosition.row) {
            addDirection('down');
          } else if (col < data.lastPosition.col) {
            addDirection('left');
          }

          latestDirection = (data.lastDirection.length > 1 && data.lastDirection[data.lastDirection.length-1] ? data.lastDirection : null);

          // if we had a change in direction...

          lastItem = data.map[data.lastPosition.row][data.lastPosition.col];

          lastClass = lastItem.className.split(' ');

          if (latestDirection && (labelToDirectionMap[latestDirection[0]] !== labelToDirectionMap[latestDirection[1]])) {

            // apply "joining" piece to last item, if applicable

            // join 'down' + 'left' to 'downLeft'
            lastClass[2] = data.lastDirection[0] + data.lastDirection[1].charAt(0).toUpperCase() + data.lastDirection[1].substr(1);

            // special case: substitute classNames in some cases
            if (correctDirectionMap[lastClass[2]]) {
              lastClass[2] = correctDirectionMap[lastClass[2]];
            }

            joinChar = typeToCharMap[lastClass[0]][lastClass[1]][lastClass[2]];

            applyCharAtPosition(joinChar, [lastClass[0], lastClass[1], lastClass[2]].join(' '), data.lastPosition.col, data.lastPosition.row);

            // apply new direction based on modified className

            selectItem([classTypes[0], classTypes[1], labelToDirectionMap[latestDirection[1]]].join(' '));

            // ensure appropriate character is applied
            classTypes[2] = labelToDirectionMap[latestDirection[1]];

          } else if (data.lastDirection && data.lastDirection[0] !== lastClass[2]) {

            // change in direction after first paint

            selectItem([classTypes[0], classTypes[1], labelToDirectionMap[data.lastDirection[0]]].join(' '));

            // ensure appropriate character is applied
            classTypes[2] = labelToDirectionMap[data.lastDirection[0]];

          }

        }

        char = typeToCharMap[classTypes[0]][classTypes[1]][classTypes[2]];

      } else {

        // eg., type-0 block

        char = typeToCharMap[classTypes[0]][classTypes[1]];

      }

      // update last position
      data.lastPosition.col = col;
      data.lastPosition.row = row;

/*
      // special case: substitute classNames in some cases
      if (data.selectedClass.length === 3 && correctDirectionMap[data.selectedClass[2]]) {
        data.selectedClass[2] = correctDirectionMap[data.selectedClass[2]];
      }
*/

      applyCharAtPosition(char, data.selectedClass, col, row);

    }

    function deleteAtPosition(col, row) {

      if (typeof data.map[row][col] !== 'undefined' && data.map[row][col].node) {

        data.map[row][col].node.parentNode.removeChild(data.map[row][col].node);
        data.map[row][col].node = null;
        data.map[row][col].char = null;
        data.map[row][col].className = null,
        data.map[row][col].classArray = [];

      }

    }

    function applyCharAtPosition(char, className, col, row, ignoreUntyped) {

      // special case: turrets inherit their class from an existing wall
      // and can only be placed when a wall is present.
      // can be ignored.

      var classArray = className.split(' ');

      var isUntypedTurret = (!ignoreUntyped && classArray[1] === 'turret');

      var isExistingWall;

      if (!data.map[row][col]) {

        if (!isUntypedTurret) {

          // uninitialized map space
          data.map[row][col] = {
            'char': null,
            'className': className,
            'classArray': classArray,
            'node': null
          }

        } else {

          // turrets are not allowed on empty space. need wall first.
          return false;

        }

      }

      if (data.map[row][col].char !== char) {

        // is it a wall? we can then apply a turret.
        isExistingWall = (data.map[row][col].classArray[1] === 'wall');

        if (isUntypedTurret) {

          if (isExistingWall) {

            // override case: turret type inherits from wall type
            classArray[0] = data.map[row][col].classArray[0];

            // new map character...
            char = typeToCharMap[classArray[0]][classArray[1]][classArray[2]];

            // and update local className
            className = classArray.join(' ');

          } else {

            // turrets can't be placed on things that aren't walls
            return false;

          }

        }

        data.map[row][col].char = char;

        if (!data.map[row][col].node) {

          // create the node

          data.map[row][col].node = document.createElement('div');

          data.map[row][col].node.style.left = (col * NODE_WIDTH) + 'px';
          data.map[row][col].node.style.top = (row * NODE_HEIGHT) + 'px';

          oContainer.appendChild(data.map[row][col].node);

        }

        // in any event, update the class name

        data.map[row][col].className = className;
        data.map[row][col].node.className = className;
        data.map[row][col].classArray = classArray;

        // glorious hack for nice transition effects
        setTimeout(function(){

          data.map[row][col].node.className = className + ' animate-in';

          // not sure if this actually improves performance on slow machines. seems like not.
          /*
            // glorious hack #2: and in another half-second, remove it.
            setTimeout(function() {
              data.map[row][col].node.className += ' animate-complete';
            }, 500);
           */

        },10);

      }

    }

    function drawRange(origFrom, origTo) {

      var lastPosition,
          from = {},
          to = {},
          i, j, k, l,
          sel = data.selectedClass.split(' '),
          className,
          char;

      // normalize from -> to in ascending order

      if (origFrom.col <= origTo.col) {
        from.col = origFrom.col;
        to.col = origTo.col;
      } else {
        from.col = origTo.col;
        to.col = origFrom.col;
      }

      if (origFrom.row <= origTo.row) {
        from.row = origFrom.row;
        to.row = origTo.row;
      } else {
        from.row = origTo.row;
        to.row = origFrom.row;
      }

      /**
        * here's where we attempt to be SMRT (--homer.)
        * if drawing a wall, just go around the perimeter
        * because filling with walls is undesirable.
        * only do perimeters if we're spanning more multiple rows and columns, though.
        */

      if (!data.selectedClass.match(/wall/i) || (from.row === to.row || from.col === to.col)) {

        // normal fill
        for (i=from.row, j=to.row; i<=j; i++) {
          for (k=from.col, l=to.col; k<=l; k++) {
            paintItemAtXY(k*NODE_WIDTH, i*NODE_HEIGHT);
          }
        }

      } else {

        // draw walls only around the edges.

        i = from.row;
        for (k=from.col, l=to.col; k<=l; k++) {
          paintItemAtXY(k*NODE_WIDTH, i*NODE_HEIGHT);
        }

        i = to.row;
        for (k=from.col, l=to.col; k<=l; k++) {
          paintItemAtXY(k*NODE_WIDTH, i*NODE_HEIGHT);
        }

        k = from.col;
        for (i=from.row, j=to.row; i<=j; i++) {
          paintItemAtXY(k*NODE_WIDTH, i*NODE_HEIGHT);
        }

        k = to.col;
        for (i=from.row, j=to.row; i<=j; i++) {
          paintItemAtXY(k*NODE_WIDTH, i*NODE_HEIGHT);
        }

        // and apply the appropriate corners as though they'd been painted individually.

        resetLastDirection();
        resetLastPosition();

        selectItem([sel[0], sel[1], 'upRight'].join(' '));
        paintItemAtXY(from.col*NODE_WIDTH, from.row*NODE_HEIGHT);

        resetLastDirection();
        resetLastPosition();

        selectItem([sel[0], sel[1], 'rightDown'].join(' '));
        paintItemAtXY(to.col*NODE_WIDTH, from.row*NODE_HEIGHT);

        resetLastDirection();
        resetLastPosition();

        selectItem([sel[0], sel[1], 'downRight'].join(' '));
        paintItemAtXY(from.col*NODE_WIDTH, to.row*NODE_HEIGHT);

        resetLastDirection();
        resetLastPosition();

        selectItem([sel[0], sel[1], 'downLeft'].join(' '));
        paintItemAtXY(to.col*NODE_WIDTH, to.row*NODE_HEIGHT);

        // restore originally-selected class?
        // selectItem(sel.join(' '));

      }

    }

    events = {

      delegated: {

        keydown: function(e) {

          var code = e.keyCode || e.charCode;

          if (keys[code]) {
            resetKeyCount(code);
            keys[code](e);
          }

        },

        mousedown: function(e) {

          var target = e.target || e.srcElement,
              nodeName = target.nodeName,
              className,
              xy,
              o;

          // are we in the editor toolbox? set "mode", in that case.

          if (target === dom.editor || isChildOf(target, dom.editor)) {

            // #editor-controls click

            // was it a block, wall, turret item etc.?

            if (nodeName.match(/^(a|input|textarea)$/i)) {

              // something clickable
              if (nodeName.toLowerCase() === 'a') {

                if (target.className && target.className.match(/exclude/i) && e.button !== 2) {

                  // must be doing something stupid, here.
                  // if there's no target attribute, just force-load the damn link.
                  if (!target.getAttribute('target')) {
                    window.location.href = target.href;
                    return false;
                  }

                  // otherwise...
                  utils.events.preventDefault(e);
                  return true;

                }

                if (target.id === 'clear-map') {
                  
                  utils.events.preventDefault(e);
                  return true;

                }

                if (target.id === 'instruction-toggle') {

                  o = document.getElementById('instructions');

                  if (o.className !== '') {

                    o.className = '';
                    o.style.height = '0px';

                  } else {

                    o.className = 'open';
                    o.style.height = o.getElementsByTagName('div')[0].offsetHeight + 'px';

                  }

                  utils.events.preventDefault(e);

                  return true;

                }

                className = target.className;

                selectItem(className);

                utils.events.preventDefault(e);

                return false;

              }

            } else {

              // start dragging

              data.isDragging = true;

              xy = utils.dom.findXY(dom.editor);

              data.mouse.lastX = (e.clientX - xy[0]);
              data.mouse.lastY = (e.clientY - xy[1]);

              utils.events.preventDefault(e);

              return false;

            }
             
          } else {

            // are we near the window boundary, though? maybe scrollbars? don't start painting in that case.

            if ((objects.screen.data.coords.width - e.clientX) <= 16 || (objects.screen.data.coords.height - e.clientY) <= 16) {

              return false;

            }

            // otherwise...

            beginPaint();

            if (e.button === 2) {

              // if right-click, then delete.

              data.isDeleting = true;

              utils.events.preventDefault(e);

              if (e.stopPropagation) {
                e.stopPropagation();
              } else {
                e.cancelBubble = true;
              }

              return false;

            }

            // if we have an anchor and the shift key is down, this is a special case. draw a range.
            if (data.lastAnchor && e.shiftKey) {

              // HACK
              // delete character at anchor point?
              // deleteAtPosition(data.lastAnchor.col, data.lastAnchor.row);

              drawRange(data.lastAnchor, xyToRowCol(e.clientX + objects.screen.data.coords.scrollX, e.clientY + objects.screen.data.coords.scrollY));

            } else {

              // "if you haven't gotten where you're going, you aren't there yet." -- George Carlin

              resetLastDirection();

              resetLastPosition();

            }

            setAnchor(xyToRowCol(e.clientX + objects.screen.data.coords.scrollX, e.clientY + objects.screen.data.coords.scrollY));

            if (!data.lastAnchor || !e.shiftKey) {

              // non-range case

              paintItemAtXY(e.clientX + objects.screen.data.coords.scrollX, e.clientY + objects.screen.data.coords.scrollY);

            }

            utils.events.preventDefault(e);

            return false;

          }

        },

        mousemove: function(e) {

          // find nearest x/y, move cursor as needed

          if (data.isPainting) {

            // "paint" objects on the grid

            paintItemAtXY(e.clientX + objects.screen.data.coords.scrollX, e.clientY + objects.screen.data.coords.scrollY);

          } else if (data.isDragging) {

            dom.editor.style.left = (e.clientX - data.mouse.lastX) + 'px';
            dom.editor.style.top = (e.clientY - data.mouse.lastY) + 'px';

          }

          // show the cursor at the relevant column + row.
          objects.cursor.moveToXY(e.clientX + objects.screen.data.coords.scrollX, e.clientY + objects.screen.data.coords.scrollY);

        },

        mouseup: function(e) {

          console.log('mouseup()');

          data.isDragging = false;

          data.isDeleting = false;

          objects.cursor.setActive(false);

          endPaint();

          generateMap();

        },

        click: function(e) {

          var target = e.target || e.srcElement;

          if (isChildOf(target, dom.editor)) {

            // #editor-controls click

            // prevent follow-through on links

            if (target.nodeName.toLowerCase() === 'a') {

              if (target.className && target.className === 'exclude') {

                window.open(target.href, 'survivorGame');
                return false;

              }

              utils.events.preventDefault(e);

              return false;

            }

          }

        }

      }

    }

    function generateMap() {

      var mapData = [];
      var i, j, k, l;
      var EMPTY_MAP_CHAR = ' ';
      var textArray = [];
      var foundItems = false;
      var removed;
      var pathName = window.location.pathname.split('/');

      for (i=0, j=data.map.length; i<j; i++) {
        mapData[i] = [];
        for (k=0, l=data.map[i].length; k<l; k++) {
          mapData[i][k] = (data.map[i][k] && data.map[i][k].char !== null ? data.map[i][k].char : EMPTY_MAP_CHAR);
        }
        textArray.push("'" + mapData[i].join('') + "'");
      }

      // simple hack: trim empty lines from bottom (assuming user builds from the top)
      
      for (i=textArray.length; i-- && !foundItems;) {
        if (textArray.length > 16 && textArray[i].match(/^\'(\s)+\'$/i)) {
          removed = textArray.splice(i, 1);
        } else {
          foundItems = true;
        }
      }

      if (removed) {
        // hack: apply one last item to the end of the array
        textArray.push(removed);
      }

      // join with slahes, remove newlines, and replace MAP_FREE_SPACE_CHAR with MAP_ALT_FREE_SPACE_CHAR
      data.mapString = textArray.join('/').replace(/\n/gi, '').replace(/\'/gi, '').replace(/\s/g, MAP_ALT_FREE_SPACE_CHAR);

      // to preserve link: drop the last item, join and add trailing slash
      pathName.splice(pathName.length-1, 1);
      pathName = pathName.join('/') + '/';

      document.getElementById('generate-map').href = (!window.location.protocol.match(/http/i) ? 'index.html' : pathName) + '?mapData=' + data.mapString;

      document.getElementById('map-data').value = textArray.join(',\n');

    }

    function parseMapFromURL() {

      var winLoc,
          paramName,
          stringOffset,
          mapData;

      paramName = 'mapData=';

      winLoc = window.location.href.toString();
      stringOffset = winLoc.indexOf(paramName);

      if (stringOffset !== -1) {

        // here's your array
        mapData = decodeURI(winLoc.substr(stringOffset + paramName.length)).split('/');

        // a valid map should have rows + columns, at least
        if (mapData.length && mapData[0].length) {

          WORLD_COLS = (mapData[0].length > WORLD_COLS ? mapData[0].length : WORLD_COLS);
          WORLD_ROWS = (mapData.length > WORLD_ROWS ? mapData.length : WORLD_ROWS);

        }

      }

      return mapData;

    }

    function drawMapFromData(mapData) {

      // loop through mapData array, drawing characters on the screen.
      var i, j, k, l,
          char;

      for (i=0, j=mapData.length; i<j; i++) {
        for (k=0, l=mapData[i].length; k<l; k++) {
          char = mapData[i].charAt(k);
          if (char !== null && char !== undefined && typeof reservedCharacters[char] === 'undefined') {
            // note use of ignoreUntypedTurret here.
            applyCharAtPosition(char, charToTypeMap[char].join(' '), k, i, true);
          }
        }
      }

    }

    function initMap() {

      var i,
          mapData;

      oContainer = document.getElementById('editor-contents');

      // has map data been provided? use that if so
      mapData = parseMapFromURL();

      // make the document reflect the world size
      oContainer.style.width = (WORLD_COLS * NODE_WIDTH) + 'px';
      oContainer.style.height = (WORLD_ROWS * NODE_HEIGHT) + 'px';

      // create an empty map
      for (i=0; i<WORLD_ROWS; i++) {
        data.map[i] = new Array(WORLD_COLS);
      }

      if (mapData) {

        // populate the map with existing data
        drawMapFromData(mapData);

        // and update the "play" link
        generateMap();

      }

      // and overflow:visible?

    }

    function addEvents() {

      utils.events.add(document, 'keydown', events.delegated.keydown);
      utils.events.add(document, 'mousedown', events.delegated.mousedown);
      utils.events.add(document, 'mousemove', events.delegated.mousemove);
      utils.events.add(document, 'mouseup', events.delegated.mouseup);
      utils.events.add(document, 'click', events.delegated.click);

    }

    function init() {

      initMap();

      dom.editor = document.getElementById('editor-controls');

      objects.screen = new Screen();
      objects.screen.init();

      objects.cursor = new Cursor(document.getElementById('editor-screen'));
      objects.cursor.init();

      addEvents();

      // choose the default thing to draw with.
      selectItem(document.getElementById('block-list').getElementsByTagName('a')[0].className);

      document.getElementById('map-data').value = '';

    }

    return {
      init: init
    }

  }());

  window.onload = function() {

    editor.init();

  }

}());
