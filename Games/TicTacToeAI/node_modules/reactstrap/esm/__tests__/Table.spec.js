import React from 'react';
import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import { Table } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('Table', function () {
  it('should render with "table" class', function () {
    testForDefaultClass(Table, 'table');
  });
  it('should render additional classes', function () {
    testForCustomClass(Table);
  });
  it('should render custom tag', function () {
    testForCustomTag(Table);
  });
  it('should render modifier classes', function () {
    render( /*#__PURE__*/React.createElement(Table, {
      "data-testid": "table",
      size: "sm",
      bordered: true,
      striped: true,
      dark: true,
      hover: true
    }));
    var node = screen.getByTestId('table');
    expect(node).toHaveClass('table');
    expect(node).toHaveClass('table-sm');
    expect(node).toHaveClass('table-bordered');
    expect(node).toHaveClass('table-striped');
    expect(node).toHaveClass('table-hover');
    expect(node).toHaveClass('table-dark');
  });
  it('should render a borderless table', function () {
    render( /*#__PURE__*/React.createElement(Table, {
      "data-testid": "table",
      borderless: true
    }));
    expect(screen.getByTestId('table')).toHaveClass('table');
    expect(screen.getByTestId('table')).toHaveClass('table-borderless');
  });
  it('should render responsive wrapper class', function () {
    render( /*#__PURE__*/React.createElement(Table, {
      "data-testid": "table",
      responsive: true
    }));
    expect(screen.getByTestId('table')).toHaveClass('table');
    expect(screen.getByTestId('table').parentNode).toHaveClass('table-responsive');
  });
  it('should render responsive wrapper class for md', function () {
    render( /*#__PURE__*/React.createElement(Table, {
      "data-testid": "table",
      responsive: "md"
    }));
    expect(screen.getByTestId('table')).toHaveClass('table');
    expect(screen.getByTestId('table').parentNode).toHaveClass('table-responsive-md');
  });
  it('should render responsive wrapper cssModule', function () {
    var cssModule = {
      table: 'scopedTable',
      'table-responsive': 'scopedResponsive'
    };
    render( /*#__PURE__*/React.createElement(Table, {
      "data-testid": "table",
      responsive: true,
      cssModule: cssModule
    }));
    expect(screen.getByTestId('table')).toHaveClass('scopedTable');
    expect(screen.getByTestId('table').parentNode).toHaveClass('scopedResponsive');
  });
});