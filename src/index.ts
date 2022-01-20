import { EventEmitter } from "events";

type Key = string;

export default class Bookkeeper<T> extends EventEmitter {
  private book: Record<Key, T[]> = {};

  add(key: string, value: T) {
    const isNew = !this.book[key];

    this.book[key] = isNew ? [value] : [...this.book[key], value];

    if (isNew) {
      this.emit("new", key);
    }
  }

  remove(key: Key, value: T) {
    const isLast = Array.isArray(this.book[key]) && this.book[key].length === 1;

    if (isLast) {
      delete this.book[key];
      this.emit("outdated", key);
    } else {
      // Be careful: all registered values with the same `value` would also be removed
      this.book[key] = this.book[key].filter((v) => v !== value);
    }
  }

  getKeys() {
    return Object.keys(this.book);
  }

  getValuesByKey(key: Key): T[] | null {
    return Array.isArray(this.book[key]) ? [...this.book[key]] : null;
  }

  // Warning: this function returns the first key it found even if the value exists in multiple lists
  getKeyByValue(value: T): Key | null {
    const entries = Object.entries(this.book);

    for (let i = 0; i < entries.length - 1; i++) {
      const key = entries[i][0];
      const values = entries[i][1];

      if (values.indexOf(value) >= 0) {
        return key;
      }
    }

    return null;
  }
}
