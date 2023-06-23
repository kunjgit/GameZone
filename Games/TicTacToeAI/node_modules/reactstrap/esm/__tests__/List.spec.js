import React from 'react';
import { render, screen } from '@testing-library/react';
import { List } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultTag } from '../testUtils';
describe('List', function () {
  it('should render with "ul" tag', function () {
    testForDefaultTag(List, 'ul');
  });
  it('should render with "list-inline" class when type is "inline"', function () {
    render( /*#__PURE__*/React.createElement(List, {
      type: "inline"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('list-inline');
  });
  it('should render with "list-unstyled" class when type is "unstyled"', function () {
    render( /*#__PURE__*/React.createElement(List, {
      type: "unstyled"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('list-unstyled');
  });
  it('should render additional classes', function () {
    testForCustomClass(List);
  });
  it('should render custom tag', function () {
    testForCustomTag(List);
  });
});