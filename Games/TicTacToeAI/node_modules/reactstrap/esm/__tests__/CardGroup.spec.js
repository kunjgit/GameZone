import { CardGroup } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardGroup', function () {
  it('should render with "card-group" class', function () {
    testForDefaultClass(CardGroup, 'card-group');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardGroup);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardGroup);
  });
});