import { generateNames, sampleSize, sample } from "@/models/random";

describe("Random", () => {
  test("should generate multiple random names", () => {
    const names = generateNames(4);
    expect(names).toHaveLength(4);
    expect(names[0]).toMatch(/\w.*/);
    expect(names[1]).toMatch(/\w.*/);
    expect(names[2]).toMatch(/\w.*/);
    expect(names[3]).toMatch(/\w.*/);
  });

  test("should return random element from array", () => {
    const arr = ["a", "b", "c", "d"];

    const item = sample(arr);

    expect(item).toBeDefined();
    expect(arr.includes(item!)).toBe(true);
  });

  test("should return undefined when sampling empty array", () => {
    const item = sample([]);
    expect(item).toBeUndefined();
  });

  describe("sampleSize", () => {
    test("should return empty array when sampling an empty array", () => {
      expect(sampleSize([])).toEqual([]);
    });

    test("should return empty array when sampling a negative number", () => {
      expect(sampleSize([], -1)).toEqual([]);
    });

    test("should return a max of arr.length items if larger number is given", () => {
      const arr = [1, 2, 3];
      const sampled = sampleSize(arr, 4);
      expect(sampled.length).toEqual(arr.length);
    });

    test("should return random elements of an array", () => {
      const arr = [1, 2, 3];
      const sampled = sampleSize(arr, 2);
      expect(sampled.length).toEqual(2);
      expect(arr.includes(sampled[0])).toBe(true);
      expect(arr.includes(sampled[1])).toBe(true);
    });

    test("should leave input array untouched", () => {
      const arr = [1, 2, 3];
      sampleSize(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });
});
