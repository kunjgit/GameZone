import { CardTitle } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('CardTitle', function () {
  it('should render with "card-title" class', function () {
    testForDefaultClass(CardTitle, 'card-title');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardTitle);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardTitle);
  });
  it('should render a "div" tag by default', function () {
    testForDefaultTag(CardTitle, 'div');
  });
});