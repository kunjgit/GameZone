import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormText } from '..';
import { testForChildrenInComponent, testForCustomClass, testForCustomTag, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('FormText', function () {
  it('should render with "form" tag', function () {
    testForDefaultTag(FormText, 'small');
  });
  it('should render children', function () {
    testForChildrenInComponent(FormText);
  });
  it('should render with "form-text" class when not inline', function () {
    testForDefaultClass(FormText, 'form-text');
  });
  it('should not render with "form-text" class when inline', function () {
    render( /*#__PURE__*/React.createElement(FormText, {
      inline: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('form-text');
  });
  it('should render with "text-muted" class by default', function () {
    render( /*#__PURE__*/React.createElement(FormText, null, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('text-muted');
  });
  it('should render without "text-*" class when color is and empty string', function () {
    render( /*#__PURE__*/React.createElement(FormText, {
      color: ""
    }, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('text-*');
  });
  it('should render with "text-${color}" class when color is provided', function () {
    render( /*#__PURE__*/React.createElement(FormText, {
      color: "yoyo"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('text-yoyo');
  });
  it('should render additional classes', function () {
    testForCustomClass(FormText);
  });
  it('should render custom tag', function () {
    testForCustomTag(FormText);
  });
});