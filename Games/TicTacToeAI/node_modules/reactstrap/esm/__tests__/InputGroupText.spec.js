import { InputGroupText } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass, testForDefaultTag } from '../testUtils';
describe('InputGroupText', function () {
  it('should render with "input-group-text" class', function () {
    testForDefaultClass(InputGroupText, 'input-group-text');
  });
  it('should render additional classes', function () {
    testForCustomClass(InputGroupText);
  });
  it('should render with "span" tag by default', function () {
    testForDefaultTag(InputGroupText, 'span');
  });
  it('should render custom tag', function () {
    testForCustomTag(InputGroupText);
  });
});