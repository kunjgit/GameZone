import { RingQueue } from "@/models/ringQueue";

describe("ring queue", () => {
  test("should have n elements", () => {
    const queue = new RingQueue([1, 2, 3, 4]);
    expect(queue.length()).toBe(4);
  });

  test("should return next element", () => {
    const queue = new RingQueue([1, 2]);
    expect(queue.next()).toBe(2);
    expect(queue.next()).toBe(1);
    expect(queue.next()).toBe(2);
  });

  test("should return current element", () => {
    const queue = new RingQueue([1, 2]);
    expect(queue.current()).toBe(1);
    expect(queue.current()).toBe(1);
  });

  test("should return current element after starting new", () => {
    const queue = new RingQueue([1, 2]);
    expect(queue.next()).toBe(2);
    expect(queue.next()).toBe(1);
    expect(queue.current()).toBe(1);
  });

  test("should change order", () => {
    const queue = new RingQueue([1, 2, 3]);

    queue.prioritize(2);

    expect(queue.current()).toBe(2);
    expect(queue.next()).toBe(3);
    expect(queue.next()).toBe(1);
  });

  test("should throw exception when prioritizing unknown element", () => {
    const queue = new RingQueue([1, 2, 3]);

    function invalidOperation() {
      queue.prioritize(4);
    }

    expect(invalidOperation).toThrowError(
      "can't prioritize unknown element '4'"
    );
  });
});
