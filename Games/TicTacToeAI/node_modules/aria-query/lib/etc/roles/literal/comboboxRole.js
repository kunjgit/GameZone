"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var comboboxRole = {
  abstract: false,
  accessibleNameRequired: true,
  baseConcepts: [],
  childrenPresentational: false,
  nameFrom: ['author'],
  prohibitedProps: [],
  props: {
    'aria-activedescendant': null,
    'aria-autocomplete': null,
    'aria-errormessage': null,
    'aria-invalid': null,
    'aria-readonly': null,
    'aria-required': null,
    'aria-expanded': 'false',
    'aria-haspopup': 'listbox'
  },
  relatedConcepts: [{
    concept: {
      attributes: [{
        name: 'aria-controls'
      }, {
        name: 'list'
      }, {
        name: 'type',
        value: 'email'
      }],
      constraints: ['the aria-controls attribute is set to the same value as the list attribute'],
      name: 'input'
    },
    module: 'HTML'
  }, {
    concept: {
      attributes: [{
        name: 'aria-controls'
      }, {
        name: 'list'
      }, {
        name: 'type',
        value: 'search'
      }],
      constraints: ['the aria-controls attribute is set to the same value as the list attribute'],
      name: 'input'
    },
    module: 'HTML'
  }, {
    concept: {
      attributes: [{
        name: 'aria-controls'
      }, {
        name: 'list'
      }, {
        name: 'type',
        value: 'tel'
      }],
      constraints: ['the aria-controls attribute is set to the same value as the list attribute'],
      name: 'input'
    },
    module: 'HTML'
  }, {
    concept: {
      attributes: [{
        name: 'aria-controls'
      }, {
        name: 'list'
      }, {
        name: 'type',
        value: 'text'
      }],
      constraints: ['the aria-controls attribute is set to the same value as the list attribute'],
      name: 'input'
    },
    module: 'HTML'
  }, {
    concept: {
      attributes: [{
        name: 'aria-controls'
      }, {
        name: 'list'
      }, {
        name: 'type',
        value: 'url'
      }],
      constraints: ['the aria-controls attribute is set to the same value as the list attribute'],
      name: 'input'
    },
    module: 'HTML'
  }, {
    concept: {
      attributes: [{
        name: 'aria-controls'
      }, {
        name: 'list'
      }, {
        name: 'type',
        value: 'url'
      }],
      constraints: ['the aria-controls attribute is set to the same value as the list attribute'],
      name: 'input'
    },
    module: 'HTML'
  }, {
    concept: {
      attributes: [{
        name: 'multiple'
      }, {
        name: 'size'
      }],
      constraints: ['the multiple attribute and the size attribute do not have a value greater than 1'],
      name: 'select'
    },
    module: 'HTML'
  }, {
    concept: {
      name: 'select'
    },
    module: 'XForms'
  }],
  requireContextRole: [],
  requiredContextRole: [],
  requiredOwnedElements: [],
  requiredProps: {
    'aria-controls': null,
    'aria-expanded': 'false'
  },
  superClass: [['roletype', 'widget', 'input']]
};
var _default = comboboxRole;
exports.default = _default;