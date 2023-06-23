import { CardLink } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardLink', function () {
  it('should render with "card-link" class', function () {
    testForDefaultClass(CardLink, 'card-link');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardLink);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardLink);
  });
});