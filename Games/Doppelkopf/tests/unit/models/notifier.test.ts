import { notifier } from "@/models/notifier";

jest.useFakeTimers();

beforeEach(() => {
  jest.runAllTimers();
});

test("should add notification", () => {
  notifier.info("Hello World");

  expect(notifier.flashMessages).toHaveLength(0);
  expect(notifier.stickies).toHaveLength(0);
  expect(notifier.notifications).toHaveLength(1);
  expect(notifier.notifications[0].text).toBe("Hello World");
});

test("should add flash message", () => {
  notifier.flash("Fuchs gefangen");

  expect(notifier.notifications).toHaveLength(0);
  expect(notifier.stickies).toHaveLength(0);
  expect(notifier.flashMessages).toHaveLength(1);
  expect(notifier.flashMessages[0].text).toBe("Fuchs gefangen");
});

test("should add sticky message", () => {
  const onClick = jest.fn();
  notifier.sticky("Update available", undefined, onClick);

  expect(notifier.notifications).toHaveLength(0);
  expect(notifier.flashMessages).toHaveLength(0);
  expect(notifier.stickies).toHaveLength(1);
  expect(notifier.stickies[0].text).toBe("Update available");
});

test("should remove notification after timeout", () => {
  const promise = notifier.info("Hello World");

  expect(notifier.notifications[0].text).toBe("Hello World");

  jest.runAllTimers();

  return promise.then(() => {
    expect(notifier.notifications).toEqual([]);
  });
});

test("should remove flash message after timeout", () => {
  const promise = notifier.flash("Hello World");

  expect(notifier.flashMessages[0].text).toBe("Hello World");

  jest.runAllTimers();

  return promise.then(() => {
    expect(notifier.flashMessages).toEqual([]);
  });
});
