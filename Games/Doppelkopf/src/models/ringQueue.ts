export class RingQueue<T> {
  private elements: T[];
  private currentIndex = 0;

  constructor(elements: T[]) {
    this.elements = elements;
  }

  length() {
    return this.elements.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.elements.length;
    return this.elements[this.currentIndex];
  }

  current() {
    return this.elements[this.currentIndex];
  }

  prioritize(element: T) {
    const foundIndex = this.elements.indexOf(element);

    if (foundIndex === -1) {
      throw new Error(`can't prioritize unknown element '${element}'`);
    }

    this.currentIndex = foundIndex;
  }

  asList() {
    return this.elements;
  }
}
