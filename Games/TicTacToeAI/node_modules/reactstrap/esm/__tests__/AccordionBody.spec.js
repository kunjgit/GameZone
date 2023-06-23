import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccordionBody, AccordionContext } from '..';
import { testForCustomClass } from '../testUtils';
describe('AccordionBody', function () {
  it('should render with "accordion-body" class within "accordion-collapse', function () {
    render( /*#__PURE__*/React.createElement(AccordionBody, {
      accordionId: "cool-accordion",
      "data-testid": "accordion-body"
    }, "accordion body"));
    expect(screen.getByTestId('accordion-body')).toHaveClass('accordion-collapse');
    expect(screen.getByText(/accordion body/i)).toHaveClass('accordion-body');
  });
  it('should render additional classes', function () {
    testForCustomClass(AccordionBody, {
      accordionId: '1'
    });
  });
  it('should render custom tag', function () {
    render( /*#__PURE__*/React.createElement(AccordionBody, {
      accordionId: "cool-accordion",
      tag: "h1"
    }, "accordion body"));
    expect(screen.getByText(/accordion body/i).tagName).toMatch(/h1/i);
  });
  it('should be open if open == id', function () {
    render( /*#__PURE__*/React.createElement(AccordionContext.Provider, {
      value: {
        open: 'cool-accordion'
      }
    }, /*#__PURE__*/React.createElement(AccordionBody, {
      accordionId: "cool-accordion",
      "data-testid": "accordion-body-1"
    }), /*#__PURE__*/React.createElement(AccordionBody, {
      accordionId: "not-cool-accordion",
      "data-testid": "accordion-body-2"
    })));
    expect(screen.getByTestId('accordion-body-1')).toHaveClass('show');
    expect(screen.getByTestId('accordion-body-2')).not.toHaveClass('show');
  });
});