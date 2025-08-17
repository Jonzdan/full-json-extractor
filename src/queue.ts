export class Queue<T> {
  private popQueue: T[];
  private pushQueue: T[];

  constructor(...value: T[]) {
    this.popQueue = [];
    this.pushQueue = value;
  }

  private migratePushToPopQueue(): void {
    while (this.pushQueue.length) {
      this.popQueue.push(this.pushQueue.pop()!);
    }
  }

  public enqueue(...value: T[]): void {
    this.pushQueue.push(...value);
  }

  public dequeue(): T | null {
    if (!this.popQueue.length) {
      this.migratePushToPopQueue();
    }

    if (!this.popQueue.length) {
      return null;
    } else {
      return this.popQueue.pop()!;
    }
  }

  public length(): number {
    return this.popQueue.length + this.pushQueue.length;
  }
}
