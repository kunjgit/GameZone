import now from './now';

declare const global;

describe('#now', () => {
  let windowSpy;
  let performanceSpy;
  let dateSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(global, 'window', 'get');
    performanceSpy = jest.spyOn(window.performance, 'now');
    dateSpy = jest.spyOn(Date, 'now');
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  it('Calls performance.now() when performance is in window', () => {
    now();

    expect(performanceSpy).toHaveBeenCalled();
  });

  it('Calls Date.now() when window is not defined', () => {
    windowSpy.mockImplementation(() => undefined);

    now();

    expect(dateSpy).toHaveBeenCalled();
  });

  it('Calls Date.now() when performance is not in window', () => {
    windowSpy.mockImplementation(() => { });

    now();

    expect(dateSpy).toHaveBeenCalled();
  });
});
