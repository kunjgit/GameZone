function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';
import { Carousel } from '..';
import CarouselItem from '../CarouselItem';
import CarouselIndicators from '../CarouselIndicators';
import CarouselControl from '../CarouselControl';
import CarouselCaption from '../CarouselCaption';
import { CarouselContext } from '../CarouselContext';
var DEFAULT_TIMER_TIME = 600;
describe('Carousel', function () {
  beforeEach(function () {
    jest.useFakeTimers();
  });
  afterEach(function () {
    jest.clearAllTimers();
  });
  var items = [{
    src: '',
    altText: 'a',
    caption: 'caption 1'
  }, {
    src: '',
    altText: 'b',
    caption: 'caption 2'
  }, {
    src: '',
    altText: 'c',
    caption: 'caption 3'
  }];
  var slides = items.map(function (item, idx) {
    return /*#__PURE__*/React.createElement(CarouselItem, {
      key: idx
    }, /*#__PURE__*/React.createElement(CarouselCaption, {
      captionText: item.caption,
      captionHeader: item.caption
    }));
  });
  describe('captions', function () {
    it('should render a header and a caption', function () {
      render( /*#__PURE__*/React.createElement(CarouselCaption, {
        captionHeader: "abc",
        captionText: "def"
      }));
      expect(screen.getByText('abc').tagName.toLowerCase()).toBe('h3');
      expect(screen.getByText('def').tagName.toLowerCase()).toBe('p');
    });
  });
  describe('items', function () {
    it('should render custom tag', function () {
      render( /*#__PURE__*/React.createElement(CarouselItem, {
        tag: "main"
      }, "Hello"));
      expect(screen.getByText(/hello/i).tagName.toLowerCase()).toBe('main');
    });
    it('should render an image if one is passed in', function () {
      render( /*#__PURE__*/React.createElement(CarouselItem, null, /*#__PURE__*/React.createElement("img", {
        src: items[0].src,
        alt: items[0].altText
      })));
      expect(screen.getByAltText(items[0].altText)).toBeInTheDocument();
    });
    it('should render a caption if one is passed in', function () {
      render( /*#__PURE__*/React.createElement(CarouselItem, null, /*#__PURE__*/React.createElement(CarouselCaption, {
        captionHeader: "header",
        captionText: "text"
      })));
      expect(screen.getByText('header')).toBeInTheDocument();
      expect(screen.getByText('text')).toBeInTheDocument();
    });
    describe('transitions', function () {
      it('should add the appropriate classes when entering right', function () {
        var wrapper = function wrapper(_ref) {
          var children = _ref.children;
          return /*#__PURE__*/React.createElement(CarouselContext.Provider, {
            value: {
              direction: 'end'
            }
          }, children);
        };
        var _render = render( /*#__PURE__*/React.createElement(CarouselItem, {
            "in": false
          }, "the mandalorian"), {
            wrapper: wrapper
          }),
          rerender = _render.rerender;
        rerender( /*#__PURE__*/React.createElement(CarouselItem, {
          "in": true
        }, "the mandalorian"));
        expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item carousel-item-start carousel-item-next');
        jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
        expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item active');
        rerender( /*#__PURE__*/React.createElement(CarouselItem, {
          "in": false
        }, "the mandalorian"));
        expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item active carousel-item-start');
        jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
        expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item');
      });
      it('should add the appropriate classes when entering left', function () {
        var wrapper = function wrapper(_ref2) {
          var children = _ref2.children;
          return /*#__PURE__*/React.createElement(CarouselContext.Provider, {
            value: {
              direction: 'start'
            }
          }, children);
        };
        var _render2 = render( /*#__PURE__*/React.createElement(CarouselItem, {
            "in": false
          }, "the mandalorian"), {
            wrapper: wrapper
          }),
          rerender = _render2.rerender;
        rerender( /*#__PURE__*/React.createElement(CarouselItem, {
          "in": true
        }, "the mandalorian"));
        expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item carousel-item-end carousel-item-prev');
        jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
        expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item active');
        rerender( /*#__PURE__*/React.createElement(CarouselItem, {
          "in": false
        }, "the mandalorian"));
        expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item active carousel-item-end');
        jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
        expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item');
      });
      it('should call all callbacks when transitioning in and out', function () {
        var callbacks = {
          onEnter: jest.fn(),
          onEntering: jest.fn(),
          onEntered: jest.fn(),
          onExit: jest.fn(),
          onExiting: jest.fn(),
          onExited: jest.fn()
        };
        var _render3 = render( /*#__PURE__*/React.createElement(CarouselItem, _extends({
            "in": false
          }, callbacks))),
          rerender = _render3.rerender;
        rerender( /*#__PURE__*/React.createElement(CarouselItem, _extends({
          "in": true
        }, callbacks)));
        expect(callbacks.onEnter).toHaveBeenCalled();
        expect(callbacks.onEntering).toHaveBeenCalled();
        expect(callbacks.onEntered).not.toHaveBeenCalled();
        jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
        expect(callbacks.onEntered).toHaveBeenCalled();
        expect(callbacks.onExit).not.toHaveBeenCalled();
        rerender( /*#__PURE__*/React.createElement(CarouselItem, _extends({
          "in": false
        }, callbacks)));
        expect(callbacks.onExit).toHaveBeenCalled();
        expect(callbacks.onExiting).toHaveBeenCalled();
        expect(callbacks.onExited).not.toHaveBeenCalled();
        jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
        expect(callbacks.onExiting).toHaveBeenCalled();
        expect(callbacks.onExited).toHaveBeenCalled();
      });
    });
  });
  describe('indicators', function () {
    it('should render a list with the right number of items', function () {
      render( /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: items,
        activeIndex: 0,
        onClickHandler: function onClickHandler() {}
      }));
      expect(screen.getAllByLabelText(/caption/i).length).toBe(3);
    });
    it('should append the correct active class', function () {
      render( /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: items,
        activeIndex: 0,
        onClickHandler: function onClickHandler() {}
      }));
      expect(screen.getByLabelText(/caption 1/i)).toHaveClass('active');
    });
    it('should call the click hanlder', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: items,
        activeIndex: 0,
        onClickHandler: onClick
      }));
      user.click(screen.getByLabelText(/caption 1/i));
      expect(onClick).toHaveBeenCalled();
    });
  });
  describe('controls', function () {
    it('should render an anchor tag', function () {
      render( /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "next",
        onClickHandler: function onClickHandler() {}
      }));
      expect(screen.getByRole('button').tagName.toLowerCase()).toBe('a');
    });
    it('should call the onClickHandler', function () {
      var onClick = jest.fn();
      render( /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "next",
        onClickHandler: onClick
      }));
      user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalled();
    });
  });
  describe('rendering', function () {
    it('should show the carousel indicators', function () {
      render( /*#__PURE__*/React.createElement(Carousel, {
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {}
      }, /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: items,
        "data-testid": "c3po",
        activeIndex: 0,
        onClickHandler: function onClickHandler() {}
      }), slides));
      expect(screen.getByTestId('c3po')).toHaveClass('carousel-indicators');
    });
    it('should show controls', function () {
      render( /*#__PURE__*/React.createElement(Carousel, {
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {}
      }, slides, /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "prev",
        directionText: "Previous",
        onClickHandler: function onClickHandler() {}
      }), /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "next",
        directionText: "Next",
        onClickHandler: function onClickHandler() {}
      })));
      screen.getAllByRole('button').forEach(function (element) {
        expect(element.className).toMatch(/carousel-control/i);
      });
    });
    it('should show a single slide', function () {
      render( /*#__PURE__*/React.createElement(Carousel, {
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {},
        "data-testid": "carousel"
      }, slides));
      expect(screen.getByTestId('carousel').getElementsByClassName('active').length).toBe(1);
    });
    it('should show indicators and controls', function () {
      render( /*#__PURE__*/React.createElement(Carousel, {
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {}
      }, /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: items,
        "data-testid": "carousel-indicator",
        activeIndex: 0,
        onClickHandler: function onClickHandler() {}
      }), slides, /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "prev",
        "data-testid": "prev",
        directionText: "Previous",
        onClickHandler: function onClickHandler() {}
      }), /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "next",
        "data-testid": "next",
        directionText: "Next",
        onClickHandler: function onClickHandler() {}
      })));
      expect(screen.getByTestId('carousel-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('prev')).toBeInTheDocument();
      expect(screen.getByTestId('next')).toBeInTheDocument();
    });
    it('should tolerate booleans, null and undefined values rendered as children of Carousel', function () {
      render( /*#__PURE__*/React.createElement(Carousel, {
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {}
      }, null, true, false, undefined, function () {}(), /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: items,
        "data-testid": "carousel-indicator",
        activeIndex: 0,
        onClickHandler: function onClickHandler() {}
      }), slides, /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "prev",
        "data-testid": "prev",
        directionText: "Previous",
        onClickHandler: function onClickHandler() {}
      }), /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "next",
        "data-testid": "next",
        directionText: "Next",
        onClickHandler: function onClickHandler() {}
      })));
      expect(screen.getByTestId('carousel-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('prev')).toBeInTheDocument();
      expect(screen.getByTestId('next')).toBeInTheDocument();
    });
    it('should not have the class "carousel-dark" by default', function () {
      render( /*#__PURE__*/React.createElement(Carousel, {
        "data-testid": "star-wars",
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {}
      }, slides));
      expect(screen.getByTestId('star-wars')).not.toHaveClass('carousel-dark');
    });
    it('should have the class "carousel-dark" when dark prop is true', function () {
      render( /*#__PURE__*/React.createElement(Carousel, {
        "data-testid": "star-wars",
        dark: true,
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {}
      }, slides));
      expect(screen.getByTestId('star-wars')).toHaveClass('carousel-dark');
    });
  });
  describe('carouseling', function () {
    var carouselItems = [{
      src: '',
      altText: 'a',
      caption: 'Grogu'
    }, {
      src: '',
      altText: 'b',
      caption: 'Boba Fett'
    }, {
      src: '',
      altText: 'c',
      caption: 'The Mandalorian'
    }];
    var carouselSlides = carouselItems.map(function (item, idx) {
      return /*#__PURE__*/React.createElement(CarouselItem, {
        key: idx
      }, item.caption);
    });
    it('should set second slide to active if second indicator clicked', function () {
      var _render4 = render( /*#__PURE__*/React.createElement(Carousel, {
          activeIndex: 0,
          next: function next() {},
          previous: function previous() {}
        }, /*#__PURE__*/React.createElement(CarouselIndicators, {
          items: carouselItems,
          "data-testid": "boba-fett",
          activeIndex: 0,
          onClickHandler: function onClickHandler() {
            return function () {};
          }
        }), carouselSlides, /*#__PURE__*/React.createElement(CarouselControl, {
          direction: "prev",
          directionText: "Previous",
          onClickHandler: function onClickHandler() {}
        }), /*#__PURE__*/React.createElement(CarouselControl, {
          direction: "next",
          directionText: "Next",
          onClickHandler: function onClickHandler() {}
        }))),
        rerender = _render4.rerender;
      user.click(screen.getByLabelText(/boba fett/i));
      rerender( /*#__PURE__*/React.createElement(Carousel, {
        activeIndex: 1,
        next: function next() {},
        previous: function previous() {}
      }, /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: carouselItems,
        "data-testid": "boba-fett",
        activeIndex: 1,
        onClickHandler: function onClickHandler() {
          return function () {};
        }
      }), carouselSlides, /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "prev",
        directionText: "Previous",
        onClickHandler: function onClickHandler() {}
      }), /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "next",
        directionText: "Next",
        onClickHandler: function onClickHandler() {}
      })));
      expect(screen.getByText(/boba fett/i)).toHaveClass('carousel-item carousel-item-start carousel-item-next');
      jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
      expect(screen.getByText(/boba fett/i)).toHaveClass('carousel-item active');
    });
    it('should go right when the index increases', function () {
      var _render5 = render( /*#__PURE__*/React.createElement(Carousel, {
          interval: 1000,
          activeIndex: 0,
          next: function next() {},
          previous: function previous() {}
        }, carouselSlides)),
        rerender = _render5.rerender;
      rerender( /*#__PURE__*/React.createElement(Carousel, {
        interval: 1000,
        activeIndex: 1,
        next: function next() {},
        previous: function previous() {}
      }, carouselSlides));
      expect(screen.getByText(/boba fett/i)).toHaveClass('carousel-item carousel-item-start carousel-item-next');
      jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
      expect(screen.getByText(/boba fett/i)).toHaveClass('active');
    });
    it('should go left when the index decreases', function () {
      var _render6 = render( /*#__PURE__*/React.createElement(Carousel, {
          interval: 1000,
          activeIndex: 1,
          next: function next() {},
          previous: function previous() {}
        }, carouselSlides)),
        rerender = _render6.rerender;
      rerender( /*#__PURE__*/React.createElement(Carousel, {
        interval: 1000,
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {}
      }, carouselSlides));
      expect(screen.getByText(/grogu/i)).toHaveClass('carousel-item carousel-item-prev carousel-item-end');
      jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
      expect(screen.getByText(/grogu/i)).toHaveClass('active');
    });
    it('should go right if transitioning from the last to first slide by non-indicator', function () {
      var _render7 = render( /*#__PURE__*/React.createElement(Carousel, {
          interval: 1000,
          activeIndex: 2,
          next: function next() {},
          previous: function previous() {}
        }, carouselSlides)),
        rerender = _render7.rerender;
      rerender( /*#__PURE__*/React.createElement(Carousel, {
        interval: 1000,
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {}
      }, carouselSlides));
      expect(screen.getByText(/grogu/i)).toHaveClass('carousel-item carousel-item-start carousel-item-next');
      jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
      expect(screen.getByText(/grogu/i)).toHaveClass('active');
    });
    it('should go left if transitioning from the last to first slide by indicator', function () {
      var _render8 = render( /*#__PURE__*/React.createElement(Carousel, {
          interval: 1000,
          activeIndex: 2,
          next: function next() {},
          previous: function previous() {}
        }, /*#__PURE__*/React.createElement(CarouselIndicators, {
          items: carouselItems,
          activeIndex: 2,
          onClickHandler: function onClickHandler() {}
        }), carouselSlides, /*#__PURE__*/React.createElement(CarouselControl, {
          direction: "prev",
          directionText: "Previous",
          onClickHandler: function onClickHandler() {}
        }), /*#__PURE__*/React.createElement(CarouselControl, {
          direction: "next",
          directionText: "Next",
          onClickHandler: function onClickHandler() {}
        }))),
        rerender = _render8.rerender;
      user.click(screen.getByLabelText(/grogu/i));
      rerender( /*#__PURE__*/React.createElement(Carousel, {
        interval: 1000,
        activeIndex: 0,
        next: function next() {},
        previous: function previous() {}
      }, /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: carouselItems,
        activeIndex: 0,
        onClickHandler: function onClickHandler() {}
      }), carouselSlides, /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "prev",
        directionText: "Previous",
        onClickHandler: function onClickHandler() {}
      }), /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "next",
        directionText: "Next",
        onClickHandler: function onClickHandler() {}
      })));
      expect(screen.getByText(/grogu/i)).toHaveClass('carousel-item carousel-item-end carousel-item-prev');
    });
    it('should go left if transitioning from the first to last slide by non-indicator', function () {
      var _render9 = render( /*#__PURE__*/React.createElement(Carousel, {
          interval: 1000,
          activeIndex: 0,
          next: function next() {},
          previous: function previous() {}
        }, carouselSlides)),
        rerender = _render9.rerender;
      rerender( /*#__PURE__*/React.createElement(Carousel, {
        interval: 1000,
        activeIndex: 2,
        next: function next() {},
        previous: function previous() {}
      }, carouselSlides));
      expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item carousel-item-end carousel-item-prev');
      jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
      expect(screen.getByText(/the mandalorian/i)).toHaveClass('active');
    });
    it('should go right if transitioning from the first to last slide by indicator', function () {
      var _render10 = render( /*#__PURE__*/React.createElement(Carousel, {
          interval: 1000,
          activeIndex: 0,
          next: function next() {},
          previous: function previous() {}
        }, /*#__PURE__*/React.createElement(CarouselIndicators, {
          items: carouselItems,
          activeIndex: 0,
          onClickHandler: function onClickHandler() {}
        }), carouselSlides, /*#__PURE__*/React.createElement(CarouselControl, {
          direction: "prev",
          directionText: "Previous",
          onClickHandler: function onClickHandler() {}
        }), /*#__PURE__*/React.createElement(CarouselControl, {
          direction: "next",
          directionText: "Next",
          onClickHandler: function onClickHandler() {}
        }))),
        rerender = _render10.rerender;
      user.click(screen.getByLabelText(/the mandalorian/i));
      rerender( /*#__PURE__*/React.createElement(Carousel, {
        interval: 1000,
        activeIndex: 2,
        next: function next() {},
        previous: function previous() {}
      }, /*#__PURE__*/React.createElement(CarouselIndicators, {
        items: carouselItems,
        activeIndex: 2,
        onClickHandler: function onClickHandler() {}
      }), carouselSlides, /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "prev",
        directionText: "Previous",
        onClickHandler: function onClickHandler() {}
      }), /*#__PURE__*/React.createElement(CarouselControl, {
        direction: "next",
        directionText: "Next",
        onClickHandler: function onClickHandler() {}
      })));
      expect(screen.getByText(/the mandalorian/i)).toHaveClass('carousel-item carousel-item-start carousel-item-next');
      jest.advanceTimersByTime(DEFAULT_TIMER_TIME);
      expect(screen.getByText(/the mandalorian/i)).toHaveClass('active');
    });
  });
  describe('interval', function () {
    it('should not autoplay by default', function () {
      var next = jest.fn();
      render( /*#__PURE__*/React.createElement(Carousel, {
        next: next,
        previous: function previous() {},
        interval: 1000,
        activeIndex: 0
      }, slides));
      jest.advanceTimersByTime(1000);
      expect(next).not.toHaveBeenCalled();
    });
    it('should autoplay when ride is carousel', function () {
      var next = jest.fn();
      render( /*#__PURE__*/React.createElement(Carousel, {
        next: next,
        previous: function previous() {},
        interval: 1000,
        activeIndex: 0,
        ride: "carousel"
      }, slides));
      jest.advanceTimersByTime(1000);
      expect(next).toHaveBeenCalled();
    });
    it('should accept a number', function () {
      var next = jest.fn();
      render( /*#__PURE__*/React.createElement(Carousel, {
        next: next,
        previous: function previous() {},
        interval: 1000,
        activeIndex: 0,
        ride: "carousel"
      }, slides));
      jest.advanceTimersByTime(1000);
      expect(next).toHaveBeenCalled();
    });
    it('should accept a boolean', function () {
      var next = jest.fn();
      render( /*#__PURE__*/React.createElement(Carousel, {
        next: next,
        previous: function previous() {},
        activeIndex: 0,
        interval: false
      }, slides));
      jest.advanceTimersByTime(5000);
      expect(next).not.toHaveBeenCalled();
    });
    it('should default to 5000', function () {
      var next = jest.fn();
      render( /*#__PURE__*/React.createElement(Carousel, {
        next: next,
        previous: function previous() {},
        activeIndex: 0,
        ride: "carousel"
      }, slides));
      jest.advanceTimersByTime(5000);
      expect(next).toHaveBeenCalled();
    });
    it('it should accept a string', function () {
      var next = jest.fn();
      render( /*#__PURE__*/React.createElement(Carousel, {
        next: next,
        previous: function previous() {},
        interval: "1000",
        activeIndex: 0,
        ride: "carousel"
      }, slides));
      jest.advanceTimersByTime(1000);
      expect(next).toHaveBeenCalled();
    });
  });
});