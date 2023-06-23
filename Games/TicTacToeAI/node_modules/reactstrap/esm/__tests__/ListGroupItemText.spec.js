import { ListGroupItemText } from '..';
import { testForChildrenInComponent, testForCustomClass, testForDefaultClass } from '../testUtils';
describe('ListGroupItem', function () {
  it('should render children', function () {
    testForChildrenInComponent(ListGroupItemText);
  });
  it('should render with "list-group-item-text" class', function () {
    testForDefaultClass(ListGroupItemText, 'list-group-item-text');
  });
});