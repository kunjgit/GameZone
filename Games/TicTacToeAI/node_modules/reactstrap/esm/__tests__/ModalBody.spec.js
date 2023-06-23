import { ModalBody } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('ModalBody', function () {
  it('should render with "modal-body" class', function () {
    testForDefaultClass(ModalBody, 'modal-body');
  });
  it('should render additional classes', function () {
    testForCustomClass(ModalBody, {});
  });
  it('should render custom tag', function () {
    testForCustomTag(ModalBody);
  });
});