/* eslint no-underscore-dangle: off */
export default class Model {
  constructor() {
    this._musicOn = true;
    this._bgMusicPlaying = false;
    this._userName = '';
  }

  set musicOn(value) {
    this._musicOn = value;
  }

  get musicOn() {
    return this._musicOn;
  }

  set userName(value) {
    this._userName = value;
  }

  get userName() {
    return this._userName;
  }

  set bgMusicPlaying(value) {
    this._bgMusicPlaying = value;
  }

  get bgMusicPlaying() {
    return this._bgMusicPlaying;
  }
}
