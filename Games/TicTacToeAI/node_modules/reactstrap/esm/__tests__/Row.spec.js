import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Row } from '..';
import { testForChildrenInComponent, testForCustomClass, testForDefaultClass } from '../testUtils';
describe('Row', function () {
  it('should render .row markup', function () {
    testForDefaultClass(Row, 'row');
  });
  it('should render children', function () {
    testForChildrenInComponent(Row);
  });
  it('should pass additional classNames', function () {
    testForCustomClass(Row);
  });
  it('show render noGutters class as gx-0', function () {
    render( /*#__PURE__*/React.createElement(Row, {
      noGutters: true,
      "data-testid": "row"
    }));
    expect(screen.getByTestId('row')).toHaveClass('gx-0 row');
  });
  it('should pass row col size specific classes as strings', function () {
    render( /*#__PURE__*/React.createElement(Row, {
      sm: "6",
      "data-testid": "row"
    }));
    expect(screen.getByTestId('row')).toHaveClass('row-cols-sm-6');
  });
  it('should pass row col size specific classes as numbers', function () {
    render( /*#__PURE__*/React.createElement(Row, {
      sm: 6,
      "data-testid": "row"
    }));
    expect(screen.getByTestId('row')).toHaveClass('row-cols-sm-6');
  });
});