"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var switchRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: true,
  nameFrom: ['author', 'contents'],
  prohibitedProps: [],
  props: {},
  relatedConcepts: [{
    concept: {
      attributes: [{
        name: 'aria-checked'
      }],
      name: 'button'
    },
    module: 'HTML'
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [],
  requiredProps: {
    'aria-checked': null
  },
  superClass: [['roletype', 'widget', 'input', 'checkbox']]
};
var _default = switchRole;
exports.default = _default;