import { OffcanvasBody } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('OffcanvasBody', function () {
  it('should render with "offcanvas-body" class', function () {
    testForDefaultClass(OffcanvasBody, 'offcanvas-body  ');
  });
  it('should render additional classes', function () {
    testForCustomClass(OffcanvasBody);
  });
  it('should render custom tag', function () {
    testForCustomTag(OffcanvasBody);
  });
});