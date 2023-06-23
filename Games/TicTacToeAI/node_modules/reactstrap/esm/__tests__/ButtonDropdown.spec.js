import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from '..';
describe('ButtonDropdown', function () {
  var isOpen;
  var toggle;
  beforeEach(function () {
    toggle = function toggle() {};
  });
  it('should render a single child', function () {
    render( /*#__PURE__*/React.createElement(ButtonDropdown, {
      isOpen: true,
      toggle: toggle
    }, "Ello world"));
    expect(screen.getByText('Ello world')).toBeInTheDocument();
  });
  it('should render multiple children when isOpen', function () {
    isOpen = true;
    render( /*#__PURE__*/React.createElement(ButtonDropdown, {
      isOpen: true,
      toggle: toggle
    }, /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"))));
    expect(screen.getByText(/toggle/i)).toBeInTheDocument();
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });
});