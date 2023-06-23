import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListGroup } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('ListGroup', function () {
  it('should render with "list-group" class', function () {
    testForDefaultClass(ListGroup, 'list-group');
  });
  it('should render with "flush"', function () {
    render( /*#__PURE__*/React.createElement(ListGroup, {
      flush: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('list-group-flush');
    expect(screen.getByText('Yo!')).toHaveClass('list-group');
  });
  it('should render with "horizontal"', function () {
    render( /*#__PURE__*/React.createElement(ListGroup, {
      horizontal: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('list-group-horizontal');
  });
  it('should not render with "horizontal" if flush is true', function () {
    render( /*#__PURE__*/React.createElement(ListGroup, {
      flush: true,
      horizontal: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('list-group');
    expect(screen.getByText('Yo!')).toHaveClass('list-group-flush');
    expect(screen.getByText('Yo!')).not.toHaveClass('list-group-horizontal');
  });
  it('should render with "horizontal-{breakpoint}"', function () {
    render( /*#__PURE__*/React.createElement(ListGroup, {
      horizontal: "lg"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('list-group');
    expect(screen.getByText('Yo!')).toHaveClass('list-group-horizontal-lg');
  });
  it('should render with "numbered"', function () {
    render( /*#__PURE__*/React.createElement(ListGroup, {
      numbered: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('list-group-numbered');
  });
  it('should render additional classes', function () {
    testForCustomClass(ListGroup);
  });
  it('should render custom tag', function () {
    testForCustomTag(ListGroup);
  });
});