"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var listboxRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author'],
  prohibitedProps: [],
  props: {
    'aria-errormessage': null,
    'aria-expanded': null,
    'aria-invalid': null,
    'aria-multiselectable': null,
    'aria-readonly': null,
    'aria-required': null,
    'aria-orientation': 'vertical'
  },
  relatedConcepts: [{
    concept: {
      attributes: [{
        name: 'size'
      }, {
        name: 'multiple'
      }],
      constraints: ['the size attribute value is greater than 1'],
      name: 'select'
    },
    module: 'HTML'
  }, {
    concept: {
      attributes: [{
        name: 'size'
      }],
      constraints: ['the size attribute value is greater than 1'],
      name: 'select'
    },
    module: 'HTML'
  }, {
    concept: {
      attributes: [{
        name: 'multiple'
      }],
      constraints: ['the multiple attribute value is greater than 1'],
      name: 'select'
    },
    module: 'HTML'
  }, {
    concept: {
      attributes: [{
        name: 'aria-multiselectable',
        value: 'true'
      }],
      constraints: ['the datalist selection model allows multiple option elements to be selected at a time'],
      name: 'datalist'
    },
    module: 'HTML'
  }, {
    concept: {
      name: 'datalist',
      attributes: [{
        name: 'aria-multiselectable',
        value: 'false'
      }]
    },
    module: 'HTML'
  }, {
    concept: {
      name: 'list'
    },
    module: 'ARIA'
  }, {
    concept: {
      name: 'select'
    },
    module: 'XForms'
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [['option', 'group'], ['option']],
  requiredProps: {},
  superClass: [['roletype', 'widget', 'composite', 'select'], ['roletype', 'structure', 'section', 'group', 'select']]
};
var _default = listboxRole;
exports.default = _default;