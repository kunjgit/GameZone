import React from 'react';
import { render, screen } from '@testing-library/react';
import { CardImg } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardImg', function () {
  it('should render with "card-img" class', function () {
    testForDefaultClass(CardImg, 'card-img');
  });
  it('should render top class name', function () {
    render( /*#__PURE__*/React.createElement(CardImg, {
      top: true,
      alt: "awesome poster",
      src: "/path/image.png"
    }));
    expect(screen.getByAltText(/awesome poster/i)).toHaveClass('card-img-top');
  });
  it('should render bottom class name', function () {
    render( /*#__PURE__*/React.createElement(CardImg, {
      bottom: true,
      alt: "awesome poster",
      src: "/path/image.png"
    }));
    expect(screen.getByAltText(/awesome poster/i)).toHaveClass('card-img-bottom');
  });
  it('should render custom tag', function () {
    testForCustomTag(CardImg);
  });
  it('should render additional classes', function () {
    testForCustomClass(CardImg);
  });
});