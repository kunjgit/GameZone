import React from 'react';
import { screen, render } from '@testing-library/react';
import { Label } from '..';
import { testForDefaultTag, testForCustomClass, testForChildrenInComponent, testForCustomTag } from '../testUtils';
describe('Label', function () {
  it('should render a label tag by default', function () {
    testForDefaultTag(Label, 'label');
  });
  it('should render children', function () {
    testForChildrenInComponent(Label);
  });
  it('should pass additional classNames', function () {
    testForCustomClass(Label);
  });
  it('should render with "col-form-label" class when a col is provided', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      sm: "6"
    }, "Yo!"));
    expect(screen.getByText(/yo/i)).toHaveClass('col-form-label');
  });
  it('should not render with "form-label" class when a col is provided', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      sm: "6"
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).not.toHaveClass('form-label');
  });
  it('should render with "form-label" class when a col is not provided', function () {
    render( /*#__PURE__*/React.createElement(Label, null, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('form-label');
  });
  it('should render with "form-check-label" class when check is specified', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      check: true
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('form-check-label');
  });
  it('should not render with "form-label" class when check is specified', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      check: true
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).not.toHaveClass('form-label');
  });
  it('should pass col size specific classes as Strings', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      sm: "6"
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-sm-6');
  });
  it('should pass col size specific classes as Strings (auto)', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      sm: "auto"
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-sm-auto');
  });
  it('should pass col size specific classes as Strings ("")', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      sm: ""
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-sm');
  });
  it('should pass col size specific classes as Strings (true)', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      sm: true
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-sm');
  });
  it('should pass col size specific classes as Strings (xs)', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      xs: "6"
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-6');
  });
  it('should pass col size specific classes as Strings (xs="")', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      xs: ""
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col');
  });
  it('should pass col size specific classes as Strings (xs (true))', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      xs: true
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col');
  });
  it('should pass col size specific classes as Strings (xs="auto")', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      xs: "auto"
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-auto');
  });
  it('should render with "visually-hidden" class when hidden prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      hidden: true
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('visually-hidden');
  });
  it('should render with "col-form-label-${size}" class when size is provided', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      size: "lg"
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-form-label-lg');
  });
  it('should pass col size specific classes as Numbers', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      sm: 6
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-sm-6');
  });
  it('should pass col size specific classes as Numbers (xs)', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      xs: 6
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-6');
  });
  it('should pass col size specific classes via Objects', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      sm: {
        size: 6,
        order: 2,
        offset: 2
      }
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-sm-6');
    expect(screen.getByText(/yo!/i)).toHaveClass('order-sm-2');
    expect(screen.getByText(/yo!/i)).toHaveClass('offset-sm-2');
  });
  it('should pass col size specific classes via Objects (xs)', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      xs: {
        size: 6,
        order: 2,
        offset: 2
      }
    }, "Yo!"));
    expect(screen.getByText(/yo!/i)).toHaveClass('col-6');
    expect(screen.getByText(/yo!/i)).toHaveClass('order-2');
    expect(screen.getByText(/yo!/i)).toHaveClass('offset-2');
  });
  it('should pass multiple col size specific classes via Objects', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      xs: {
        size: 4,
        order: 3,
        offset: 3
      },
      sm: {
        size: 6,
        order: 2,
        offset: 2
      },
      md: {
        size: 7,
        order: 1,
        offset: 1
      }
    }, "Yo!"));
    expect(screen.getByText(/yo/i)).toHaveClass('col-4');
    expect(screen.getByText(/yo/i)).toHaveClass('order-3');
    expect(screen.getByText(/yo/i)).toHaveClass('offset-3');
    expect(screen.getByText(/yo/i)).toHaveClass('col-sm-6');
    expect(screen.getByText(/yo/i)).toHaveClass('order-sm-2');
    expect(screen.getByText(/yo/i)).toHaveClass('offset-sm-2');
    expect(screen.getByText(/yo/i)).toHaveClass('col-md-7');
    expect(screen.getByText(/yo/i)).toHaveClass('order-md-1');
    expect(screen.getByText(/yo/i)).toHaveClass('offset-md-1');
  });
  it('should render custom tag', function () {
    render( /*#__PURE__*/React.createElement(Label, {
      tag: "main"
    }, "Yo!"));
    testForCustomTag(Label, {}, 'main');
  });
});