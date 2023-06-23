import { ListInlineItem } from '..';
import { testForChildrenInComponent, testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('ListInlineItem', function () {
  it('should render children', function () {
    testForChildrenInComponent(ListInlineItem);
  });
  it('should render with "list-inline-item" class', function () {
    testForDefaultClass(ListInlineItem, 'list-inline-item');
  });
  it('should render additional classes', function () {
    testForCustomClass(ListInlineItem);
  });
  it('should render custom tag', function () {
    testForCustomTag(ListInlineItem);
  });
});