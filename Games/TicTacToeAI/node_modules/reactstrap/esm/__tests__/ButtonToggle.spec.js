import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { ButtonToggle } from '..';
import { testForChildrenInComponent } from '../testUtils';
describe('ButtonToggle', function () {
  it('should render children', function () {
    testForChildrenInComponent(ButtonToggle);
  });
  it('should have button already toggled for defaultValue true', function () {
    render( /*#__PURE__*/React.createElement(ButtonToggle, {
      defaultValue: true
    }, "Ello world"));
    expect(screen.getByText(/world/i)).toHaveClass('active');
  });
  describe('onClick', function () {
    it('calls props.onClick if it exists', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(ButtonToggle, {
        onClick: onClick
      }, "Testing Click"));
      user.click(screen.getByText(/testing click/i));
      expect(onClick).toHaveBeenCalled();
    });
    it('should not call props.onClick if it exists and button is disabled', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(ButtonToggle, {
        onClick: onClick,
        disabled: true
      }, "Testing Click"));
      user.click(screen.getByText(/testing click/i));
      expect(onClick).not.toHaveBeenCalled();
    });
  });
  describe('onFocus', function () {
    it('calls props.onFocus if it exists', function () {
      var onFocus = jest.fn();
      render( /*#__PURE__*/React.createElement(ButtonToggle, {
        onFocus: onFocus
      }, "Testing Click"));
      screen.getByText(/testing click/i).focus();
      expect(onFocus).toHaveBeenCalled();
    });
  });
  describe('onBlur', function () {
    it('calls props.onBlur if it exists', function () {
      var onBlur = jest.fn();
      render( /*#__PURE__*/React.createElement(ButtonToggle, {
        onBlur: onBlur
      }, "Testing Click"));
      screen.getByText(/testing click/i).focus();
      screen.getByText(/testing click/i).blur();
      expect(onBlur).toHaveBeenCalled();
    });
  });
});