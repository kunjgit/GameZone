import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BreadcrumbItem } from '..';
import { testForChildrenInComponent, testForCustomTag, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('BreadcrumbItem', function () {
  it('should render children', function () {
    testForChildrenInComponent(BreadcrumbItem);
  });
  it('should render "li" by default', function () {
    testForDefaultTag(BreadcrumbItem, 'li');
  });
  it('should render with the "breadcrumb-item" class', function () {
    testForDefaultClass(BreadcrumbItem, 'breadcrumb-item');
  });
  it('should not render with the "active" class by default', function () {
    render( /*#__PURE__*/React.createElement(BreadcrumbItem, null, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('active');
  });
  it('should render with the "active" class when the avtive prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(BreadcrumbItem, {
      active: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('active');
  });
  it('should render custom tag', function () {
    testForCustomTag(BreadcrumbItem);
  });
});