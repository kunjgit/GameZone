import React from 'react';
import { shallow, mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { InputGroup, DropdownMenu, DropdownToggle, DropdownItem, Input } from '..';
import Dropdown from '../Dropdown';
import { testForChildrenInComponent, testForCustomClass, testForCustomTag, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('InputGroup', function () {
  it('should render with "div" tag', function () {
    testForDefaultTag(InputGroup, 'div');
  });
  it('should render children', function () {
    testForChildrenInComponent(InputGroup);
  });
  it('should render with "input-group" class', function () {
    testForDefaultClass(InputGroup, 'input-group');
  });
  it('should render with "input-group-${size}" class when size is passed', function () {
    render( /*#__PURE__*/React.createElement(InputGroup, {
      size: "whatever"
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('input-group-whatever');
  });
  it('should render additional classes', function () {
    testForCustomClass(InputGroup);
  });
  it('should render custom tag', function () {
    testForCustomTag(InputGroup);
  });
  describe('When type="dropdown"', function () {
    it('should render Dropdown', function () {
      render( /*#__PURE__*/React.createElement(InputGroup, {
        type: "dropdown",
        "data-testid": "drpdwn"
      }));
      expect(screen.getByTestId('drpdwn')).toHaveClass('dropdown');
    });
    it('should call toggle when input is clicked', function () {
      var toggle = jest.fn();
      render( /*#__PURE__*/React.createElement(InputGroup, {
        type: "dropdown",
        isOpen: true,
        toggle: toggle
      }, /*#__PURE__*/React.createElement(Input, null), /*#__PURE__*/React.createElement(DropdownToggle, null, "Toggle"), /*#__PURE__*/React.createElement(DropdownMenu, {
        right: true
      }, /*#__PURE__*/React.createElement(DropdownItem, null, "Test"), /*#__PURE__*/React.createElement(DropdownItem, {
        id: "divider",
        divider: true
      }))));
      expect(toggle).not.toBeCalled();
      user.click(document.querySelector('input.form-control'));
      expect(toggle).toBeCalled();
    });
  });
});