'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var click = require('../convenience/click.js');
var hover = require('../convenience/hover.js');
var tab = require('../convenience/tab.js');
var index = require('../keyboard/index.js');
var copy = require('../clipboard/copy.js');
var cut = require('../clipboard/cut.js');
var paste = require('../clipboard/paste.js');
var index$1 = require('../pointer/index.js');
var clear = require('../utility/clear.js');
var selectOptions = require('../utility/selectOptions.js');
var type = require('../utility/type.js');
var upload = require('../utility/upload.js');



exports.click = click.click;
exports.dblClick = click.dblClick;
exports.tripleClick = click.tripleClick;
exports.hover = hover.hover;
exports.unhover = hover.unhover;
exports.tab = tab.tab;
exports.keyboard = index.keyboard;
exports.copy = copy.copy;
exports.cut = cut.cut;
exports.paste = paste.paste;
exports.pointer = index$1.pointer;
exports.clear = clear.clear;
exports.deselectOptions = selectOptions.deselectOptions;
exports.selectOptions = selectOptions.selectOptions;
exports.type = type.type;
exports.upload = upload.upload;
