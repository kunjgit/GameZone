import { ToastBody } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('ToastBody', function () {
  it('should render with "toast-body" class', function () {
    testForDefaultClass(ToastBody, 'toast-body');
  });
  it('should render additional classes', function () {
    testForCustomClass(ToastBody);
  });
  it('should render custom tag', function () {
    testForCustomTag(ToastBody);
  });
});