import { ButtonToolbar } from '..';
import { testForChildrenInComponent, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('ButtonToolbar', function () {
  it('should render children', function () {
    testForChildrenInComponent(ButtonToolbar);
  });
  it('should render with the "btn-toolbar" class', function () {
    testForDefaultClass(ButtonToolbar, 'btn-toolbar');
  });
  it('should render custom tag', function () {
    testForCustomTag(ButtonToolbar);
  });
});