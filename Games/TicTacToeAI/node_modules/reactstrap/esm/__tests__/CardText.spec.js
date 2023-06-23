import { CardText } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardText', function () {
  it('should render with "card-text" class', function () {
    testForDefaultClass(CardText, 'card-text');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardText);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardText);
  });
});