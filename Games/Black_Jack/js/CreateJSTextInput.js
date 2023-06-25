/**
 * Created by Andrew on 3/19/16.
 */
class TextInput extends createjs.Container {
  constructor() {
    super();

    // Field Settings
    this.width = 200;
    this.height = 40;

    // Text Settings
    this.placeHolder = '';
    this.placeHolderTextColor = '#999';
    this.textColor = '#222';
    this.fontSize = 20;
    this.cursorWidth = 2;
    this.cursorColor = '#555';

    // Private Settings
    this._hiddenInput = null;
    this._bg = null;
    this._placeHolderText = null;
    this._visiblePreCursorText = null;
    this._visiblePostCursorText = null;
    this._preCursorText = "";
    this._postCursorText = "";
    this._cursor = null;
    this._padding = 0;
    this._focused = false;
    this._selectedDuration = 0;

    this._setupDomNode();
    this._setupField();
    this._setupListeners();
  }

  update() {
    this._setupField();
  }

  _getFontStyle() {
    return '20px Arial';
  }

  _setupDomNode() {
    this._hiddenInput = document.createElement('input');
    this._hiddenInput.type = 'text';
    this._hiddenInput.style.display = 'none';
    this._hiddenInput.style.position = 'absolute';
    this._hiddenInput.style.zIndex = -100;
    document.body.appendChild(this._hiddenInput);
  }

  _setupField() {
    this._setupVariables();
    this._setupBg();
    this._setupPlaceHolderText();
    this._setupVisibleText();
    this._setupCursor();
  }

  _setupVariables() {
    this._padding = this.height - this.fontSize * 1.5;
  }

  _setupBg() {
    if (this._bg === null) {
      this._bg = new createjs.Shape();
      this.addChild(this._bg);
    } else {
      this._bg.graphics.clear();
    }
    this._bg.graphics.beginFill('#ccc').drawRect(0, 0, this.width, this.height);
  }

  _setupPlaceHolderText() {
    if (this._placeHolderText === null) {
      this._placeHolderText = new createjs.Text(
        this.placeHolder,
        this._getFontStyle(),
        this.placeHolderTextColor
      );
      this._placeHolderText.y = this._placeHolderText.x = this._padding;
      this.addChild(this._placeHolderText);
    } else {
      this._placeHolderText.text = this.placeHolder;
    }
  }

  _setupVisibleText() {
    if (this._visiblePreCursorText === null) {
      this._visiblePreCursorText = new createjs.Text(
        this._preCursorText,
        this._getFontStyle(),
        this.textColor
      );
      this._visiblePreCursorText.y = this._visiblePreCursorText.x = this._padding;
      this.addChild(this._visiblePreCursorText);
    } else {
      this._visiblePreCursorText.text = this._preCursorText;
    }

    if (this._visiblePostCursorText === null) {
      this._visiblePostCursorText = new createjs.Text(
        this._postCursorText,
        this._getFontStyle(),
        this.textColor
      );
      this._visiblePostCursorText.y = this._visiblePostCursorText.x = this._padding;
      this.addChild(this._visiblePostCursorText);
    } else {
      this._visiblePostCursorText.text = this._postCursorText;
    }
  }

  _setupCursor() {
    if (this._cursor === null) {
      this._cursor = new createjs.Shape();
      this._cursor.graphics
        .beginFill(this.cursorColor)
        .drawRect(this._padding, this.fontSize * .25, this.cursorWidth, this.fontSize * 1.5);
      this._cursor.x = 0; // this will signify pure text offset
      this._cursor.visible = false;
      this.addChild(this._cursor);
    } else {

    }
  }

  _setupListeners() {
    window.addEventListener('click', (e) => {
      // Page
      const pX = e.pageX;
      const pY = e.pageY;
      // Canvas
      if (this.stage === null) return;
      const cX = this.stage.canvas.offsetLeft;
      const cY = this.stage.canvas.offsetTop;
      // Local
      const lX = pX - cX - this.x;
      const lY = pY - cY - this.y;

      this._click({x: lX, y: lY});
    });
    this._hiddenInput.addEventListener('input', (e) => {
      if (this._focused) {
        e.preventDefault();
        this._preCursorText = this._hiddenInput.value;
        this.update();
        this._cursor.x = this._visiblePreCursorText.getMeasuredWidth();
      }
    });

    this.on('tick', () => this._tick);
  }

  _click(localXY) {
    this._focused = (
      localXY.x > 0 &&
      localXY.y > 0 &&
      localXY.x < this.width &&
      localXY.y < this.height
    );
    this._selectedDuration = 0;

    this._placeHolderText.visible = !this._focused && this._hiddenInput.value === "";
    if (this._focused) {
      this._selectInput();
    } else {
      this._deSelectInput();
      this._cursor.visible = false;
    }
  }

  _tick() {
    if (this._focused) {
      if (this._selectedDuration % 8 === 0) {
        this._cursor.visible = !this._cursor.visible;
      }
      this._selectedDuration++;
    }
  }

  _selectInput() {
    this._hiddenInput.style.display = 'block';
    this._hiddenInput.style.left = (this.x + this.stage.canvas.offsetLeft + this._padding) + 'px';
    this._hiddenInput.style.top = (this.y + this.stage.canvas.offsetTop + this._padding) + 'px';
    this._hiddenInput.focus();
  }

  _deSelectInput() {
    this._hiddenInput.style.display = 'none';
  }
}