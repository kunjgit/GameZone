import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '..';
import { testForDefaultTag } from '../testUtils';
describe('Input', function () {
  it('should render with "input" tag when no type is provided', function () {
    testForDefaultTag(Input, 'input');
  });
  it('should render with "type" tag when type is "select"', function () {
    var _render = render( /*#__PURE__*/React.createElement(Input, {
        type: "select"
      }, "Yo!")),
      container = _render.container;
    expect(container.querySelector('select')).toBeInTheDocument();
  });
  it('should render with "textarea" tag when type is "textarea"', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "textarea",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input').tagName.toLowerCase()).toMatch('textarea');
  });
  it('should render with "input" tag when plaintext prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select",
      plaintext: true,
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input').tagName.toLowerCase()).toMatch('input');
  });
  it('should render with "form-control-plaintext" class when plaintext prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select",
      plaintext: true,
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-control-plaintext');
  });
  it('should not render with "form-control" class when plaintext prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select",
      plaintext: true,
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('form-control');
  });
  it('should render with custom tag when plaintext prop is truthy and tag is provided', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select",
      plaintext: true,
      tag: "div",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input').tagName.toLowerCase()).toMatch('div');
  });
  it('should render with custom tag when plaintext prop is not truthy and tag is provided', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      tag: "div",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input').tagName.toLowerCase()).toMatch('div');
  });
  it('should render with "input" tag when type is not a special case', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "email",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input').tagName.toLowerCase()).toMatch('input');
  });
  it('should not render children', function () {
    render( /*#__PURE__*/React.createElement(Input, null, "Yo!"));
    expect(screen.queryByText('Yo!')).not.toBeInTheDocument();
  });
  it('should render without children when type is "textarea"', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "textarea"
    }, "Yo!"));
    expect(screen.queryByText('Yo!')).not.toBeInTheDocument();
  });
  it('should render children when type is select', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toBeInTheDocument();
  });
  it('should render children when tag is select', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      tag: "select"
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toBeInTheDocument();
  });
  it('should pass children when tag is a custom component', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      tag: function tag(props) {
        return props.children;
      }
    }, "Yo!"));
    expect(screen.getByText('Yo!')).toBeInTheDocument();
  });
  it('should not render with "is-invalid" class when valid is false', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      valid: false,
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('is-invalid');
  });
  it('should not render with "is-valid" class when invalid is false', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      invalid: false,
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('is-valid');
  });
  it('should render with "is-invalid" class when invalid is true', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      invalid: true,
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('is-invalid');
  });
  it('should render with "is-valid" class when valid is true', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      valid: true,
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('is-valid');
  });
  it('should render with "form-control-${bsSize}" class when bsSize is "lg" or "sm"', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      bsSize: "lg",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-control-lg');
  });
  it('should render with "form-select-${bsSize}" class when bsSize is "lg" or "sm" and type is select', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select",
      bsSize: "lg",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-select-lg');
  });
  it('should render with "form-control" class when size is nor "lg" nor "sm"', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      bsSize: "5",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-control');
    expect(screen.getByTestId('input')).not.toHaveClass('form-control-sm');
    expect(screen.getByTestId('input')).not.toHaveClass('form-control-lg');
  });
  it('should render with "form-select" class when size is nor "lg" nor "sm" and type is select', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select",
      bsSize: "5",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-select');
    expect(screen.getByTestId('input')).not.toHaveClass('form-select-sm form-select-lg');
  });
  it('should render with "form-control-${bsSize}" class when bsSize is provided', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      bsSize: "sm",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-control-sm');
  });
  it('should render with "form-select-${bsSize}" class when bsSize is provided and type is select', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select",
      bsSize: "sm",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-select-sm');
  });
  it('should render with "form-control" class by default', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-control');
  });
  it('should not render with "form-control-plaintext" nor "form-check-input" class by default', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('form-control-plaintext');
    expect(screen.getByTestId('input')).not.toHaveClass('form-check-input');
  });
  it('should not render with "form-control-plaintext" nor "form-check-input" class when type is file', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "file",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('form-control-plaintext');
    expect(screen.getByTestId('input')).not.toHaveClass('form-check-input');
  });
  it('should not render with "form-control" nor "form-control-plaintext" nor "form-check-input" class when type is select', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('form-control');
    expect(screen.getByTestId('input')).not.toHaveClass('form-control-plaintext');
    expect(screen.getByTestId('input')).not.toHaveClass('form-check-input');
  });
  it('should not render with "form-control" nor "form-check-input" class when plaintext prop is truthy', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "file",
      plaintext: true,
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('form-control');
    expect(screen.getByTestId('input')).not.toHaveClass('form-check-input');
  });
  it('should not render nor "form-control-plaintext" nor "form-control" class when type is radio', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "radio",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('form-control');
    expect(screen.getByTestId('input')).not.toHaveClass('form-control-plaintext');
  });
  it('should not render nor "form-control-plaintext" nor "form-control" class when type is checkbox', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "checkbox",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('form-control');
    expect(screen.getByTestId('input')).not.toHaveClass('form-control-plaintext');
  });
  it('should render with "form-check-input" class when type is checkbox', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "checkbox",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-check-input');
  });
  it('should render with "form-check-input" class when type is radio', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "radio",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-check-input');
  });
  it('should render with "form-check-input" class when type is switch', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "switch",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-check-input');
  });
  it('should not render with "form-check-input" nor "form-control" class when type is checkbox and addon is truthy', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      addon: true,
      type: "checkbox",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('form-check-input');
    expect(screen.getByTestId('input')).not.toHaveClass('form-control');
  });
  it('should not render with "form-check-input" nor "form-control" class when type is radio and addon is truthy', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      addon: true,
      type: "radio",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveClass('form-check-input');
    expect(screen.getByTestId('input')).not.toHaveClass('form-control');
  });
  it('should render with "form-select" class when type is select', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-select');
  });
  it('should render with "form-control" class when type is file', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "file",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-control');
  });
  it('should render additional classes', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      className: "other",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('other');
  });
  it('should render checkbox type when type is switch', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "switch",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'checkbox');
  });
  it('should render "select" and "textarea" without type property', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "select"
    }, "Yo!"));
    render( /*#__PURE__*/React.createElement(Input, {
      type: "textarea",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).not.toHaveAttribute('type');
    expect(screen.getByText('Yo!')).not.toHaveAttribute('type');
  });
  it('should render with "form-range" not "form-control" class when type is range', function () {
    render( /*#__PURE__*/React.createElement(Input, {
      type: "range",
      "data-testid": "input"
    }));
    expect(screen.getByTestId('input')).toHaveClass('form-range');
    expect(screen.getByTestId('input')).not.toHaveClass('form-control');
  });
});