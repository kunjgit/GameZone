import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '..';
import { testForChildrenInComponent, testForCustomTag, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('Badge', function () {
  it('should render a span by default', function () {
    testForDefaultTag(Badge, 'span');
  });
  it('should render an anchor when when href is provided', function () {
    render( /*#__PURE__*/React.createElement(Badge, {
      href: "#",
      "data-testid": "badge"
    }, "Yo!"));
    expect(screen.getByTestId('badge').tagName.toLowerCase()).toBe('a');
  });
  it('should render a custom tag when provided', function () {
    testForCustomTag(Badge);
  });
  it('should render children', function () {
    testForChildrenInComponent(Badge);
  });
  it('should render badges with secondary color', function () {
    testForDefaultClass(Badge, 'bg-secondary');
  });
  it('should render Badges with other colors', function () {
    render( /*#__PURE__*/React.createElement(Badge, {
      color: "danger",
      "data-testid": "badge"
    }, "Danger Badge"));
    expect(screen.getByTestId('badge')).toHaveClass('bg-danger');
  });
  it('should render Badges as pills', function () {
    render( /*#__PURE__*/React.createElement(Badge, {
      pill: true,
      "data-testid": "badge"
    }, "Pill Badge"));
    expect(screen.getByTestId('badge')).toHaveClass('rounded-pill');
  });
});