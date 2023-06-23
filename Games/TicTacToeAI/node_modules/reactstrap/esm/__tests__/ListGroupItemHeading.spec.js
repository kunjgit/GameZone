import { ListGroupItemHeading } from '..';
import { testForChildrenInComponent, testForDefaultClass } from '../testUtils';
describe('ListGroupItem', function () {
  it('should render children', function () {
    testForChildrenInComponent(ListGroupItemHeading);
  });
  it('should render with "list-group-item-heading" class', function () {
    testForDefaultClass(ListGroupItemHeading, 'list-group-item-heading');
  });
});