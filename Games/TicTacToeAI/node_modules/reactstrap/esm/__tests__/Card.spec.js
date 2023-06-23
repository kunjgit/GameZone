import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('Card', function () {
  it('should render with "card" class', function () {
    testForDefaultClass(Card, 'card');
  });
  it('should render with "bg-primary" class', function () {
    render( /*#__PURE__*/React.createElement(Card, {
      inverse: true,
      body: true,
      color: "primary"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('card card-body bg-primary text-white');
  });
  it('should render with "outline" class when a color is provided', function () {
    render( /*#__PURE__*/React.createElement(Card, {
      outline: true,
      body: true,
      color: "primary"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('card card-body border-primary');
  });
  it('should not render with "outline" class when a color is not provided (no default)', function () {
    render( /*#__PURE__*/React.createElement(Card, {
      outline: true,
      body: true
    }, "Yo!"));
    expect(screen.getByText('Yo!').className).not.toMatch(/border/i);
  });
  it('should render additional classes', function () {
    testForCustomClass(Card);
  });
  it('should render custom tag', function () {
    testForCustomTag(Card);
  });
});