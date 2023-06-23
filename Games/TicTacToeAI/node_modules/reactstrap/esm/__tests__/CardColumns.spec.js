import { CardColumns } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardColumns', function () {
  it('should render with "card-columns" class', function () {
    testForDefaultClass(CardColumns, 'card-columns');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardColumns);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardColumns);
  });
});