import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccordionItem } from '..';
import { testForCustomClass, testForCustomTag } from '../testUtils';
describe('AccordionItem', function () {
  it('should render with "accordion-item" class', function () {
    render( /*#__PURE__*/React.createElement(AccordionItem, {
      "data-testid": "accordion-item"
    }));
    expect(screen.getByTestId('accordion-item')).toHaveClass('accordion-item');
  });
  it('should render additional classes', function () {
    testForCustomClass(AccordionItem);
  });
  it('should render custom tag', function () {
    testForCustomTag(AccordionItem);
  });
});