declare module "interval-tree-1d" {
    type Interval = [number, number];

    interface IntervalTree {
        readonly count: number;
        insert(interval: Interval): void;
        readonly intervals: Interval[];
        queryInterval(
            lo: number,
            hi: number,
            cb: (interval: Interval) => any,
        ): any;
        queryPoint(x: number, cb: (interval: Interval) => any): any;
        remove(interval: Interval): boolean;
        root: IntervalTreeNode | null;
    }

    interface IntervalTreeNode {
        count: number;
        insert(interval: Interval): void;
        intervals(result?: Interval[]): Interval[];
        left: IntervalTreeNode | null;
        leftPoints: Interval[];
        mid: number;
        queryInterval(
            lo: number,
            hi: number,
            cb: (interval: Interval) => any,
        ): any;
        queryPoint(x: number, cb: (interval: Interval) => any): any;
        remove(interval: Interval): number;
        right: IntervalTreeNode | null;
        rightPoints: Interval[];
    }

    function createWrapper(intervals?: Interval[]): IntervalTree;

    export = createWrapper;
}
