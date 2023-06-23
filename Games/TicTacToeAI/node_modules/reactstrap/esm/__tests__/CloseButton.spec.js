import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CloseButton from '../CloseButton';
describe('CloseButton', function () {
  it('should render a close button', function () {
    render( /*#__PURE__*/React.createElement(CloseButton, {
      "data-testid": "close-btn"
    }));
    expect(screen.getByTestId('close-btn')).toHaveClass('btn-close');
  });
  it('should render white variant', function () {
    render( /*#__PURE__*/React.createElement(CloseButton, {
      variant: "white",
      "data-testid": "close-btn"
    }));
    expect(screen.getByTestId('close-btn')).toHaveClass('btn-close-white');
  });
  describe('onClick', function () {
    it('calls props.onClick if it exists', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(CloseButton, {
        onClick: onClick,
        "data-testid": "btn-close"
      }));
      user.click(screen.getByTestId('btn-close'));
      expect(onClick).toHaveBeenCalled();
    });
    it('returns the value returned by props.onClick', function () {
      var onClick = jest.fn(function () {
        return 1234;
      });
      render( /*#__PURE__*/React.createElement(CloseButton, {
        onClick: onClick,
        "data-testid": "btn-close"
      }));
      user.click(screen.getByTestId('btn-close'));
      expect(onClick.mock.results[0].value).toBe(1234);
    });
    it('is not called when disabled', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(CloseButton, {
        onClick: onClick,
        disabled: true,
        "data-testid": "btn-close"
      }));
      user.click(screen.getByTestId('btn-close'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});