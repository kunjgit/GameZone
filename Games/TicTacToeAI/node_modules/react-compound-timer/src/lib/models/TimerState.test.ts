import TimerState, { INITED, PLAYING, PAUSED, STOPPED } from './TimerState';

describe('#TimerState', () => {
  it('should set INITED state in constructor', () => {
    const state = new TimerState();

    expect(state.getState()).toEqual(INITED);
  });

  it('should return false when set INITED from INITED', () => {
    const state = new TimerState();

    expect(state.setInited()).toEqual(false);
  });

  it('should return true when set INITED from PLAYING', () => {
    const state = new TimerState();

    state.setPlaying();

    expect(state.setInited()).toEqual(true);
  });

  it('should return false when set PLAYING from PLAYING', () => {
    const state = new TimerState();

    state.setPlaying();

    expect(state.setPlaying()).toEqual(false);
  });

  it('should return true when set PLAYING from INITED', () => {
    const state = new TimerState();

    expect(state.setPlaying()).toEqual(true);
  });

  it('should return true when set PAUSED from PLAYING', () => {
    const state = new TimerState();

    state.setPlaying();

    expect(state.setPaused()).toEqual(true);
  });

  it('should return false when set INITED from PAUSED', () => {
    const state = new TimerState();

    expect(state.setPaused()).toEqual(false);
  });

  it('should return false when set STOPPED from INITED', () => {
    const state = new TimerState();

    expect(state.setStopped()).toEqual(false);
  });

  it('should return true when set PLAYING from STOPPED', () => {
    const state = new TimerState();

    state.setPlaying();

    expect(state.setStopped()).toEqual(true);
  });

  it('should set PLAYING state', () => {
    const state = new TimerState();

    state.setPlaying();

    expect(state.getState()).toEqual(PLAYING);
  });

  it('should set INITED state', () => {
    const state = new TimerState();

    state.setPlaying();
    state.setInited();

    expect(state.getState()).toEqual(INITED);
  });

  it('should not set PAUSED state when not in PLAYING', () => {
    const state = new TimerState();

    state.setPaused();

    expect(state.getState()).not.toEqual(PAUSED);
    expect(state.getState()).toEqual(INITED);
  });

  it('should set PAUSED state when in PLAYING', () => {
    const state = new TimerState();

    state.setPlaying();
    state.setPaused();

    expect(state.getState()).toEqual(PAUSED);
  });

  it('should not set STOPPED state when in INITED', () => {
    const state = new TimerState();

    state.setStopped();

    expect(state.getState()).not.toEqual(STOPPED);
    expect(state.getState()).toEqual(INITED);
  });

  it('should set STOPPED state when not in INITED', () => {
    const state = new TimerState();

    state.setPlaying();
    state.setStopped();

    expect(state.getState()).toEqual(STOPPED);
  });

  it('should call onChange handler with INITED timer state on setInited', () => {
    const mockCallback = jest.fn(({ state }) => state);
    const state = new TimerState(mockCallback);

    state.setPlaying();
    state.setInited();

    expect(mockCallback.mock.results[1].value).toEqual(INITED);
  });

  it('should call onChange handler with PLAYING timer state on setPlaying', () => {
    const mockCallback = jest.fn(({ state }) => state);
    const state = new TimerState(mockCallback);

    state.setPlaying();

    expect(mockCallback.mock.results[0].value).toEqual(PLAYING);
  });

  it('should call onChange handler with PAUSED timer state on setPaused', () => {
    const mockCallback = jest.fn(({ state }) => state);
    const state = new TimerState(mockCallback);

    state.setPlaying();
    state.setPaused();

    expect(mockCallback.mock.results[1].value).toEqual(PAUSED);
  });

  it('should call onChange handler with STOPPED timer state on setStopped', () => {
    const mockCallback = jest.fn(({ state }) => state);
    const state = new TimerState(mockCallback);

    state.setPlaying();
    state.setStopped();

    expect(mockCallback.mock.results[1].value).toEqual(STOPPED);
  });

  it('should return true for isInited in INITED state', () => {
    const state = new TimerState();

    expect(state.isInited()).toBeTruthy();
  });

  it('should return true for isPlaying in PLAYING state', () => {
    const state = new TimerState();

    state.setPlaying();

    expect(state.isPlaying()).toBeTruthy();
  });

  it('should return true for isPaused in PAUSED state', () => {
    const state = new TimerState();

    state.setPlaying();
    state.setPaused();

    expect(state.isPaused()).toBeTruthy();
  });

  it('should return true for isStopped in STOPPED state', () => {
    const state = new TimerState();

    state.setPlaying();
    state.setStopped();

    expect(state.isStopped()).toBeTruthy();
  });
});
