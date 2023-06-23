import { CardDeck } from '..';
import { testForCustomClass, testForCustomTag, testForDefaultClass } from '../testUtils';
describe('CardDeck', function () {
  it('should render with "card-deck" class', function () {
    testForDefaultClass(CardDeck, 'card-deck');
  });
  it('should render additional classes', function () {
    testForCustomClass(CardDeck);
  });
  it('should render custom tag', function () {
    testForCustomTag(CardDeck);
  });
});