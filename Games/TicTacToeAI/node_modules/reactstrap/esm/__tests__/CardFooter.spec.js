import { CardFooter } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardFooter', function () {
  it('should render with "card-footer" class', function () {
    testForDefaultClass(CardFooter, 'card-footer');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardFooter);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardFooter);
  });
});