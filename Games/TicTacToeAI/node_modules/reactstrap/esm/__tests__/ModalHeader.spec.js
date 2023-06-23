import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalHeader } from '..';
import { testForCustomClass, testForDefaultClass } from '../testUtils';
describe('ModalHeader', function () {
  it('should render with "modal-header" class', function () {
    testForDefaultClass(ModalHeader, 'modal-header');
  });
  it('should render additional classes', function () {
    testForCustomClass(ModalHeader);
  });
  it('should render close button', function () {
    render( /*#__PURE__*/React.createElement(ModalHeader, {
      toggle: function toggle() {},
      "data-testid": "test",
      className: "other"
    }, "Yo!"));
    var node = screen.getByTestId('test').querySelector('button');
    expect(node.tagName.toLowerCase()).toBe('button');
    expect(node).toHaveClass('btn-close');
  });
  it('should render custom tag', function () {
    render( /*#__PURE__*/React.createElement(ModalHeader, {
      tag: "main"
    }, "hello"));
    expect(screen.getByText(/hello/i).tagName.toLowerCase()).toBe('main');
  });
  it('should render custom wrapping tag', function () {
    render( /*#__PURE__*/React.createElement(ModalHeader, {
      "data-testid": "test",
      wrapTag: "main"
    }));
    expect(screen.getByTestId('test').tagName.toLowerCase()).toMatch('main');
  });
});