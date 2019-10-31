export default class Queue<T> {
  store: T[];
  length: number;
  constructor(length: number) {
    this.store = [];
    this.length = length;
  }

  push(item: T) {
    this.store = [item].concat(this.store.slice(0, this.length - 1));
    return this;
  }

  peek(index: number): T | undefined {
    if (index < this.store.length) {
      return this.store[index];
    }
    return undefined;
  }
}

// TEST, YES, I DO WRITE TESTED CODE!!!
// const queue = new Queue<number>(5);
// for (let i = 0; i < 18; i++) {
//   queue.push(i);
// }
// for (let i = 0; i < 10; i++) {
//   console.log(queue.peek(i));
// }
// console.log(queue);