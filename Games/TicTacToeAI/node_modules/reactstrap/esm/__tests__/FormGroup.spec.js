import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormGroup } from '..';
import { testForChildrenInComponent, testForCustomClass, testForCustomTag, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('FormGroup', function () {
  it('should render with "div" tag by default', function () {
    testForDefaultTag(FormGroup, 'div');
  });
  it('should render children', function () {
    testForChildrenInComponent(FormGroup);
  });
  it('should render with "mb-3" class by default', function () {
    testForDefaultClass(FormGroup, 'mb-3');
  });
  it('should not render with "form-check" nor "form-check-inline"  class by default', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, null, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('form-check');
    expect(screen.getByText('Yo!')).not.toHaveClass('form-check-inline');
  });
  it('should render with "form-check" class when check prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      check: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('form-check');
  });
  it('should render with "form-check" and "form-switch" class when switch prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      "switch": true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('form-check');
    expect(screen.getByText('Yo!')).toHaveClass('form-switch');
  });
  it('should not render with "form-check-inline" class when check prop is truthy and inline prop is falsy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      check: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('form-check-inline');
  });
  it('should not render with "form-check-inline" class when switch prop is truthy and inline prop is falsy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      "switch": true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('form-check-inline');
  });
  it('should render with "form-check" and "form-check-inline" classes when check prop and inline prop are both truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      check: true,
      inline: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('form-check');
    expect(screen.getByText('Yo!')).toHaveClass('form-check-inline');
  });
  it('should render with "form-check" and "form-switch" and "form-check-inline" classes when check prop and inline prop are both truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      "switch": true,
      inline: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('form-check');
    expect(screen.getByText('Yo!')).toHaveClass('form-switch');
    expect(screen.getByText('Yo!')).toHaveClass('form-check-inline');
  });
  it('should not render with "form-check-inline" class when check and switch prop are falsy and inline prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      inline: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('form-check');
  });
  it('should not render with "mb-3" class when check prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      check: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('mb-3');
  });
  it('should not render with "mb-3" class when switch prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      "switch": true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('mb-3');
  });
  it('should not render with "disabled" class when disabled prop is truthy but check and switch are not', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      disabled: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('disabled');
  });
  it('should render with "disabled" class when both check disabled props are truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      check: true,
      disabled: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('disabled');
    expect(screen.getByText('Yo!')).toHaveClass('form-check');
  });
  it('should render with "disabled" class when both switch and disabled props are truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      "switch": true,
      disabled: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('disabled');
    expect(screen.getByText('Yo!')).toHaveClass('form-check');
  });
  it('should render with "row" class when row prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      row: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('row');
  });
  it('should not render with "row" class when row prop is not truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, null, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('row');
  });
  it('should render with "form-floating" class when floating prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, {
      floating: true
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('form-floating');
  });
  it('should not render with "form-floating" class when floating prop is falsey', function () {
    render( /*#__PURE__*/React.createElement(FormGroup, null, "Yo!"));
    expect(screen.getByText('Yo!')).not.toHaveClass('form-floating');
  });
  it('should render additional classes', function () {
    testForCustomClass(FormGroup);
  });
  it('should render custom tag', function () {
    testForCustomTag(FormGroup);
  });
});