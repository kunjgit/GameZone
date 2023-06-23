import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from '..';
import { testForChildrenInComponent, testForCustomTag, testForDefaultTag } from '../testUtils';
describe('Breadcrumb', function () {
  it('should render children', function () {
    testForChildrenInComponent(Breadcrumb);
  });
  it('should render "nav" by default', function () {
    testForDefaultTag(Breadcrumb, 'nav');
  });
  it('should render "ol" by default', function () {
    render( /*#__PURE__*/React.createElement(Breadcrumb, null, "Yo!"));
    expect(screen.getByText('Yo!').tagName.toLowerCase()).toMatch('ol');
  });
  it('should render with the "breadcrumb" class', function () {
    render( /*#__PURE__*/React.createElement(Breadcrumb, {
      "data-testid": "test"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('breadcrumb');
  });
  it('should render custom tag', function () {
    testForCustomTag(Breadcrumb);
  });
});