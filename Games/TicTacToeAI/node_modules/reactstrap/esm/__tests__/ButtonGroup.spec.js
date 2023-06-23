import React from 'react';
import { render, screen } from '@testing-library/react';
import { ButtonGroup } from '..';
import { testForChildrenInComponent, testForCustomTag } from '../testUtils';
describe('ButtonGroup', function () {
  it('should render children', function () {
    testForChildrenInComponent(ButtonGroup);
  });
  it('should render different size classes', function () {
    render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ButtonGroup, {
      size: "sm"
    }, "Small Button"), /*#__PURE__*/React.createElement(ButtonGroup, {
      size: "lg"
    }, "Large Button")));
    expect(screen.getByText(/small/i)).toHaveClass('btn-group-sm');
    expect(screen.getByText(/large/i)).toHaveClass('btn-group-lg');
  });
  it('should render vertical class', function () {
    render( /*#__PURE__*/React.createElement(ButtonGroup, {
      vertical: true
    }, "Vertical Group"));
    expect(screen.getByText(/vertical/i)).toHaveClass('btn-group-vertical');
  });
  it('should render custom tag', function () {
    testForCustomTag(ButtonGroup);
  });
});