import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { ListGroupItem } from '..';
import { testForChildrenInComponent, testForDefaultClass } from '../testUtils';
describe('ListGroupItem', function () {
  it('should render children', function () {
    testForChildrenInComponent(ListGroupItem);
  });
  it('should render with "list-group-item" class', function () {
    testForDefaultClass(ListGroupItem, 'list-group-item');
  });
  it('should render with "active" class when active is passed', function () {
    render( /*#__PURE__*/React.createElement(ListGroupItem, {
      active: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('active');
  });
  it('should render with "disabled" class when disabled is passed', function () {
    render( /*#__PURE__*/React.createElement(ListGroupItem, {
      disabled: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('disabled');
  });
  it('should render with "list-group-item-action" class when action is passed', function () {
    render( /*#__PURE__*/React.createElement(ListGroupItem, {
      action: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('list-group-item-action');
  });
  it('should render with "list-group-item-${color}" class when color is passed', function () {
    render( /*#__PURE__*/React.createElement(ListGroupItem, {
      color: "success"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('list-group-item-success');
  });
  it('should prevent click event when disabled is passed', function () {
    var onDisableClick = jest.fn();
    render( /*#__PURE__*/React.createElement(ListGroupItem, {
      disabled: true,
      onClick: onDisableClick
    }, "Yo!"));
    user.click(screen.getByText('Yo!'));
    expect(onDisableClick).not.toHaveBeenCalled();
  });
});