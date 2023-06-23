import { ModalFooter } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('ModalFooter', function () {
  it('should render with "modal-footer" class', function () {
    testForDefaultClass(ModalFooter, 'modal-footer');
  });
  it('should render additional classes', function () {
    testForCustomClass(ModalFooter);
  });
  it('should render custom tag', function () {
    testForCustomTag(ModalFooter);
  });
});