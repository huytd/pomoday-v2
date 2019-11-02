export default class Queue<T> {
  store: T[];
  length: number;
  constructor(length: number) {
    this.store = [];
    this.length = length;
  }

  deserialize(serialized: any): Queue<T> {
    this.store = serialized.store;
    this.length = serialized.length;
    return this;
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

  match(comparator: (item: T) => boolean): T[] {
    return this.store.filter(comparator);
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

// Test the matcher
// const queue = new Queue<string>(5);
// queue.push("foo");
// queue.push("bar");
// queue.push("foobeep");
// queue.push("barboop");
// const matched = queue.match((item: string) => item.indexOf("foo") !== -1);
// console.log(matched);
