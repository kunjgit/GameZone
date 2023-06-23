import { CardHeader } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardHeader', function () {
  it('should render with "card-header" class', function () {
    testForDefaultClass(CardHeader, 'card-header');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardHeader);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardHeader);
  });
});