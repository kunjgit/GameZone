class TypoGraphy {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} size 
   * @param {string} letter 
   * @param {Verly} verlyInstance 
   */
  constructor(x, y, size, letter, verlyInstance) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.stickDistance = this.size;
    this.iterations = 50;
    // A
    this.A = [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1]
    ]
    // B
    this.B = [
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0]
    ]

    // C
    this.C = [
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0]
    ]

    // D
    this.D = [
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0]
    ];

    // E
    this.E = [
      [0, 1, 1, 1, 0],
      [0, 1, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 0, 0],
      [0, 1, 1, 1, 0]
    ]

    // S
    this.S = [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 0, 0]
    ]

    // I 
    this.I = [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0]
    ]


    // K
    this.K = [
      [1, 0, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [1, 0, 1, 1, 0]
    ]

    // U
    this.U = [
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0]
    ]

    // N
    this.N = [
      [0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 1, 1],
      [1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1],
      [1, 1, 0, 0, 1, 1]
    ]

    // R
    this.R = [
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0]
    ]

    // G
    this.G = [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0]
    ]

    // L
    this.L = [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ]

    // Y
    this.Y = [
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0]
    ]

    // V
    this.V = [
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0]
    ]

    //X
    this.X = [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ]

    //P
    this.P = [
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 1, 0, 0]
    ]

    //H
    this.H = [
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1]
    ]

    //O
    this.O = [
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0]
    ]

    this.letters = {
      A: this.A,
      B: this.B,
      C: this.C,
      D: this.D,
      E: this.E,
      K: this.K,
      I: this.I,
      S: this.S,
      U: this.U,
      N: this.N,
      R: this.R,
      G: this.G,
      L: this.L,
      Y: this.Y,
      V: this.V,
      X: this.X,
      P: this.P,
      H: this.H,
      O: this.O,
    }


    let gridArray = this.letters[letter];

    this.text = new Entity(this.iterations, verlyInstance);
    // this.text.renderPoints = function() {};

    for (let x = 0; x < gridArray.length; x++) {
      for (let y = 0; y < gridArray[x].length; y++) {
        if (gridArray[y][x] == 1) {
          let p = new Point(this.x + x * this.size, this.y + y * this.size);
          p.setRadius(2);
          this.text.addPoint(p);
        }
      }
    }

    // join
    for (let i = 0; i < this.text.points.length; i++) {
      for (let j = 0; j < this.text.points.length; j++) {
        if (this.text.points[i] == this.text.points[j]) break;
        let d = this.text.points[i].pos.dist(this.text.points[j].pos);

        if (d > 0 && d < this.size + this.stickDistance) {
          this.text.addStick(i, j);
        }
      }
    }
  }
}

export default TypoGraphy;