import { Form } from '..';
import { testForChildrenInComponent, testForCustomClass, testForCustomTag, testForDefaultTag } from '../testUtils';
describe('Form', function () {
  it('should render with "form" tag', function () {
    testForDefaultTag(Form, 'form');
  });
  it('should render children', function () {
    testForChildrenInComponent(Form);
  });
  it('should render additional classes', function () {
    testForCustomClass(Form);
  });
  it('should render custom tag', function () {
    testForCustomTag(Form);
  });
});