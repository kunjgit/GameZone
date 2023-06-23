import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Spinner } from '..';
import { testForChildrenInComponent, testForCustomTag } from '../testUtils';
describe('Spinner', function () {
  it('should render a span by default', function () {
    render( /*#__PURE__*/React.createElement(Spinner, null));
    expect(screen.getByText('Loading...').tagName.toLowerCase()).toMatch('span');
  });
  it('should render a custom tag when provided', function () {
    testForCustomTag(Spinner, {}, 'main');
  });
  it('should default render "Loading..." children', function () {
    render( /*#__PURE__*/React.createElement(Spinner, null));
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  it('should render children', function () {
    testForChildrenInComponent(Spinner);
  });
  it('should render visually-hidden children', function () {
    render( /*#__PURE__*/React.createElement(Spinner, null, "Yo!"));
    expect(screen.getByText('Yo!')).toHaveClass('visually-hidden');
  });
  it('should render default type of border', function () {
    render( /*#__PURE__*/React.createElement(Spinner, null));
    expect(screen.getByRole('status')).toHaveClass('spinner-border');
  });
  it('should render type if specified', function () {
    render( /*#__PURE__*/React.createElement(Spinner, {
      type: "grow"
    }));
    expect(screen.getByRole('status')).toHaveClass('spinner-grow');
  });
  it('should render size if specified', function () {
    render( /*#__PURE__*/React.createElement(Spinner, {
      size: "sm"
    }));
    expect(screen.getByRole('status')).toHaveClass('spinner-border-sm');
    expect(screen.getByRole('status')).toHaveClass('spinner-border');
  });
  it('should render color if specified', function () {
    render( /*#__PURE__*/React.createElement(Spinner, {
      color: "primary"
    }));
    expect(screen.getByRole('status')).toHaveClass('text-primary');
  });
});