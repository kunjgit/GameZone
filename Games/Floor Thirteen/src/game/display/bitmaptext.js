function BitmapText(text) {
  DisplayObjectContainer.call(this);
  text && this.t(text);
}

__extend(BitmapText, DisplayObjectContainer, {
  t: function setText(text) {
    // Remove children
    this._c = [];

    // Grab all letters
    var letters = ('' + text).split('');
    var i = 0, n = letters.length, letter, sprite, offset = 0;

    for (; i < n; i++) {
      // Currently only digits, space and slash are supported
      letter = letters[i];
      if (letter == ' ') {
        offset += 3;
      } else {
        sprite = this.a(new Sprite(__textureManager.g(letters[i])));
        sprite.x = offset;
        offset += sprite.tx.f.w - 1;
      }
    }
  }
});
