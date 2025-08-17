export type Interval = [number, number];

interface IntervalTreeNode {
  mid: number;
  left: IntervalTreeNode | null;
  right: IntervalTreeNode | null;
  leftPoints: Interval[];
  rightPoints: Interval[];
  count: number;
  intervals(result?: Interval[]): Interval[];
  insert(interval: Interval): void;
  remove(interval: Interval): number;
  queryPoint(x: number, cb: (interval: Interval) => any): any;
  queryInterval(lo: number, hi: number, cb: (interval: Interval) => any): any;
}

export interface IntervalTreeType {
  root: IntervalTreeNode | null;
  insert(interval: Interval): void;
  remove(interval: Interval): boolean;
  queryPoint(x: number, cb: (interval: Interval) => any): any;
  queryInterval(lo: number, hi: number, cb: (interval: Interval) => any): any;
  readonly count: number;
  readonly intervals: Interval[];
}

export interface MemoPosition {
  readonly left: number;
  readonly right: number;
}

export interface BraceLocationInfo {
  readonly prefix: number[];
  readonly suffix: number[];
}

export type Limit = "log2" | "none";
