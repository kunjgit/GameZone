import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Container } from '..';
import { testForChildrenInComponent, testForCustomClass, testForCustomTag } from '../testUtils';
describe('Container', function () {
  it('should render .container markup', function () {
    render( /*#__PURE__*/React.createElement(Container, {
      "data-testid": "container"
    }));
    expect(screen.getByTestId('container')).toHaveClass('container');
  });
  it('should render .container-fluid markup', function () {
    render( /*#__PURE__*/React.createElement(Container, {
      fluid: true,
      "data-testid": "container"
    }));
    expect(screen.getByTestId('container')).toHaveClass('container-fluid');
  });
  it('should render children', function () {
    testForChildrenInComponent(Container);
  });
  it('should pass additional classNames', function () {
    testForCustomClass(Container);
  });
  it('should render custom tag', function () {
    testForCustomTag(Container);
  });
  it('should render responsive breakpoints with string fluid props', function () {
    render( /*#__PURE__*/React.createElement(Container, {
      fluid: "md",
      "data-testid": "container"
    }));
    expect(screen.getByTestId('container')).toHaveClass('container-md');
    expect(screen.getByTestId('container')).not.toHaveClass('container-fluid');
  });
});