export interface BraceLocationInfo {
    readonly prefix: number[];
    readonly suffix: number[];
}

export type Interval = [number, number];

export interface IntervalTreeType {
    readonly count: number;
    insert(interval: Interval): void;
    readonly intervals: Interval[];
    queryInterval(lo: number, hi: number, cb: (interval: Interval) => any): any;
    queryPoint(x: number, cb: (interval: Interval) => any): any;
    remove(interval: Interval): boolean;
    root: IntervalTreeNode | null;
}

export type Limit = "log2" | "none";

/**
 * [left, right]: [number, number]
 */
export type MemoPosition = [number, number];

interface IntervalTreeNode {
    count: number;
    insert(interval: Interval): void;
    intervals(result?: Interval[]): Interval[];
    left: IntervalTreeNode | null;
    leftPoints: Interval[];
    mid: number;
    queryInterval(lo: number, hi: number, cb: (interval: Interval) => any): any;
    queryPoint(x: number, cb: (interval: Interval) => any): any;
    remove(interval: Interval): number;
    right: IntervalTreeNode | null;
    rightPoints: Interval[];
}
