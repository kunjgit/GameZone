import { CardSubtitle } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('CardSubtitle', function () {
  it('should render with "card-subtitle" class', function () {
    testForDefaultClass(CardSubtitle, 'card-subtitle');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardSubtitle);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardSubtitle);
  });
  it('should render a "div" tag by default', function () {
    testForDefaultTag(CardSubtitle, 'div');
  });
});