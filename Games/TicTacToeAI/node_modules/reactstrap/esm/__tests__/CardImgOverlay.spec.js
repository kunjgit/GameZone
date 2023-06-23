import { CardImgOverlay } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardImgOverlay', function () {
  it('should render with "card-img-overlay" class', function () {
    testForDefaultClass(CardImgOverlay, 'card-img-overlay');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardImgOverlay);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardImgOverlay);
  });
});