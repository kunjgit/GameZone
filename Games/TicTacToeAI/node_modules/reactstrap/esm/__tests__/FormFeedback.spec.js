import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormFeedback } from '..';
import { testForChildrenInComponent, testForCustomClass, testForCustomTag, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('FormFeedback', function () {
  it('should render with "div" tag by default', function () {
    testForDefaultTag(FormFeedback, 'div');
  });
  it('should render children', function () {
    testForChildrenInComponent(FormFeedback);
  });
  it('should render with "invalid-feedback" class', function () {
    testForDefaultClass(FormFeedback, 'invalid-feedback');
  });
  it('should render with "valid-feedback" class', function () {
    render( /*#__PURE__*/React.createElement(FormFeedback, {
      valid: true
    }, "Yo!"));
    expect(screen.getByText(/yo/i)).toHaveClass('valid-feedback');
  });
  it('should render with "valid-tooltip" class', function () {
    render( /*#__PURE__*/React.createElement(FormFeedback, {
      valid: true,
      tooltip: true
    }, "Yo!"));
    expect(screen.getByText(/yo/i)).toHaveClass('valid-tooltip');
  });
  it('should render additional classes', function () {
    testForCustomClass(FormFeedback);
  });
  it('should render custom tag', function () {
    testForCustomTag(FormFeedback);
  });
});