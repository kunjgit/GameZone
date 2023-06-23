import { CardBody } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardBody', function () {
  it('should render with "card-body" class', function () {
    testForDefaultClass(CardBody, 'card-body');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardBody);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardBody);
  });
});