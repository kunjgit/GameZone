import React from 'react';
import { shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Placeholder } from '..';
import { testForCustomClass, testForDefaultClass } from '../testUtils';
describe('Placeholder', function () {
  it('should render with "placeholder" class', function () {
    testForDefaultClass(Placeholder, 'placeholder');
  });
  it('should render column size', function () {
    render( /*#__PURE__*/React.createElement(Placeholder, {
      "data-testid": "test",
      xs: 7
    }));
    expect(screen.getByTestId('test')).toHaveClass('col-7');
  });
  it('should render animation', function () {
    render( /*#__PURE__*/React.createElement(Placeholder, {
      "data-testid": "test",
      tag: "p",
      animation: "glow"
    }));
    expect(screen.getByTestId('test')).toHaveClass('placeholder-glow');
  });
  it('should render color', function () {
    render( /*#__PURE__*/React.createElement(Placeholder, {
      "data-testid": "test",
      xs: 12,
      color: "primary"
    }));
    expect(screen.getByTestId('test')).toHaveClass('bg-primary');
  });
  it('should render size', function () {
    render( /*#__PURE__*/React.createElement(Placeholder, {
      "data-testid": "test",
      size: "lg",
      xs: 12
    }));
    expect(screen.getByTestId('test')).toHaveClass('placeholder-lg');
  });
  it('should render different widths for different breakpoints', function () {
    render( /*#__PURE__*/React.createElement(Placeholder, {
      "data-testid": "test",
      size: "lg",
      xs: 12,
      lg: 8
    }));
    var node = screen.getByTestId('test');
    expect(node).toHaveClass('col-lg-8');
    expect(node).toHaveClass('col-12');
  });
  it('should allow custom columns to be defined', function () {
    render( /*#__PURE__*/React.createElement(Placeholder, {
      "data-testid": "test",
      widths: ['base', 'jumbo'],
      base: "4",
      jumbo: "6"
    }));
    var node = screen.getByTestId('test');
    expect(node).toHaveClass('col-4');
    expect(node).toHaveClass('col-jumbo-6');
  });
  it('should allow custom columns to be defined with objects', function () {
    render( /*#__PURE__*/React.createElement(Placeholder, {
      "data-testid": "test",
      widths: ['base', 'jumbo', 'custom'],
      custom: {
        size: 1,
        order: 2,
        offset: 4
      }
    }));
    var node = screen.getByTestId('test');
    expect(node).toHaveClass('col-custom-1');
    expect(node).toHaveClass('order-custom-2');
    expect(node).toHaveClass('offset-custom-4');
    expect(node).not.toHaveClass('col');
  });
});