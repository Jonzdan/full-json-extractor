import {
  BraceLocationInfo,
  IntervalTreeType,
  Limit,
  MemoPosition,
} from "./interfaces";
import { Queue } from "./queue";
import IntervalTree from "interval-tree-1d";

const LBRACE = "{";
const RBRACE = "}";

class JsonExtractError extends Error {}

function convertMemoPositionToKey(memoPosition: MemoPosition) {
  return `${memoPosition.left}-${memoPosition.right}`;
}

function generateBracesPrefixAndSufix(input: string): BraceLocationInfo {
  const prefix: number[] = [];
  const suffix: number[] = [];

  for (let i = 0; i < input.length; i++) {
    if (input[i] == LBRACE) {
      prefix.push(i);
    } else if (input[i] == RBRACE) {
      suffix.push(i);
    }
  }

  return {
    prefix,
    suffix,
  };
}

function queryIntervalSync(
  tree: IntervalTreeType,
  low: number,
  high: number,
): boolean {
  let intervalExists: boolean = false;
  tree.queryInterval(low, high, (interval: [number, number]) => {
    const [left, right] = interval;
    if (left < low && high < right) {
      intervalExists = true;
      return;
    }
  });
  return intervalExists;
}

/**
 * Coarse pre-check to filter out invalid json candidates. Short circuits if >1 json candidates exist in slice
 * @param input
 * @param left
 * @param right
 * @returns
 */
function isBalancedWithOneJson(
  input: string,
  left: number,
  right: number,
  limit: Limit,
): boolean {
  const terminationThreshold = generateLimit(input, left, limit);
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  let firstJsonObj = true;

  for (let i = left; i <= right; i++) {
    if (i >= terminationThreshold) {
      return true;
    }
    const char = input[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === LBRACE) {
      braceCount++;
    } else if (char === RBRACE) {
      braceCount--;
    }

    if (braceCount < 0) {
      return false;
    }

    if (braceCount === 0) {
      if (!firstJsonObj) {
        return false;
      }
      firstJsonObj = !firstJsonObj;
    }
  }

  return braceCount === 0;
}

function findValidJsons(
  { prefix, suffix }: BraceLocationInfo,
  input: string,
  limit: Limit,
): object[] {
  const tree = IntervalTree();
  const startingPosition: MemoPosition = {
    left: 0,
    right: suffix.length - 1,
  };
  const queue: Queue<MemoPosition> = new Queue(startingPosition);
  const memo = new Set<string>([convertMemoPositionToKey(startingPosition)]);
  const jsons: object[] = [];

  while (queue.length()) {
    const { left: leftIndex, right: rightIndex } = queue.dequeue()!;
    const leftPosition: number = prefix[leftIndex]!;
    const rightPosition: number = suffix[rightIndex]!;

    if (
      rightPosition < leftPosition ||
      queryIntervalSync(tree, leftPosition, rightPosition)
    ) {
      continue;
    }

    try {
      if (isBalancedWithOneJson(input, leftPosition, rightPosition, limit)) {
        jsons.push(JSON.parse(input.slice(leftPosition, rightPosition + 1)));
        tree.insert([leftPosition, rightPosition]);
        continue;
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error as JsonExtractError;
      }
    }

    const positions: MemoPosition[] = [
      {
        left: leftIndex,
        right: rightIndex - 1 >= 0 ? rightIndex - 1 : rightIndex,
      },
      {
        left: leftIndex + 1 < prefix.length ? leftIndex + 1 : leftIndex,
        right: rightIndex,
      },
    ];

    for (const position of positions) {
      const key = convertMemoPositionToKey(position);
      if (!memo.has(key)) {
        queue.enqueue(position);
        memo.add(key);
      }
    }
  }
  return jsons;
}

function generateLimit(input: string, left: number, limit: Limit) {
  switch (limit) {
    case "log2":
      return left + Math.ceil(Math.log2(input.length));
    case "none":
      return input.length;
    default:
      throw new JsonExtractError("unknown limit type provided");
  }
}

/**
 * Extracts json objects from a given input string
 * @param input input string
 * @param limit Sets pre-check behavior. If set to 'log2', method will terminate pre-check after reaching log2(n) characters. Useful for large malformed data i.e. many {} + non-json text
 * Else, will do a O(n) scan to coarsely validate brace matches. Useful for many json objects (i.e. early termination)
 * @returns array of JSON objects
 */
export function extractJsons(input: string, limit: Limit = "none"): object[] {
  if (!input?.length) {
    return [];
  }

  const locations = generateBracesPrefixAndSufix(input);
  if (!locations.prefix.length || !locations.suffix.length) {
    return [];
  }

  return findValidJsons(locations, input, limit);
}
