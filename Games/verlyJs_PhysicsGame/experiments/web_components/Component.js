class VerlyCanvas extends HTMLCanvasElement {
  constructor() {
    super();
    this.ctx = this.getContext('2d');
    this.verly = new Verly(16, this, this.ctx);
    // this.width = this.getAttribute('width')
    // this.height = this.getAttribute('height')
  }

  connectedCallback() {
    // window.width = this.width;
    // window.height = this.height;
    // window.ctx = this.ctx;

    window.onload = () => {
      var entities = this.getElementsByTagName('verly-entity');
      // console.log(this['verly-box'])
      for (var i = 0; i < entities.length; i++) {
        let type = entities[i].attributes.type.value;
        let posx = parseFloat(entities[i].attributes.x.value);
        let posy = parseFloat(entities[i].attributes.y.value);
        switch (type) {
          case 'box':
            this.verly.createBox(posx, posy, 100, 100);
            break;
          case 'cloth':
            this.verly.createCloth(posx, posy, 200, 200, 10, 1);
            break;
          case 'hexagon':
            this.verly.createHexagon(posx, posy, 10, 50, 1, 4)
            break;
        }
      }
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.verly.update();
      this.verly.render();
      this.verly.interact();

      this.verly.renderPointIndex();

      requestAnimationFrame(animate);
    }
    animate();
  }

  disconnectedCallback() {
    console.log('Custom square element removed from page.');
  }

  adoptedCallback() {
    console.log('Custom square element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.');
  }
}

// Define the new element
// customElements.define('verly-canvas', VerlyCanvas);
// document.createElement("canvas", { is: "verly-canvas" })
customElements.define('verly-canvas', VerlyCanvas, { extends: "canvas" });

class VerlyBox extends HTMLElement {
  constructor(x, y, w, h) {
    super();
    const box = new Entity(this.iterations);

    box.addPoint(x, y, 0, 0);
    box.addPoint(x + w, y, 0, 0);
    box.addPoint(x + w, y + h, 0, 0);
    box.addPoint(x, y + h, 0, 0);
    box.addStick(0, 1);
    box.addStick(1, 2);
    box.addStick(2, 3);
    box.addStick(3, 0);
    box.addStick(3, 1);

    console.log(box);
    return this;
    // return box;
  }
}
customElements.define('verly-box', VerlyBox);

