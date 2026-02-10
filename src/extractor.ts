import {
    BraceLocationInfo,
    Limit,
} from "./interfaces";

const LBRACE = "{";
const RBRACE = "}";

class JsonExtractError extends Error {}

/**
 * Extracts json objects from a given input string
 * @param input input string
 * @param limit Sets pre-check behavior. If set to 'log2', method will terminate pre-check after reaching log2(n) characters. Useful for extremely large malformed data i.e. many {} + non-json text
 * Else, will do a O(n) pre-check scan to coarsely validate brace matches. Useful for many json objects (i.e. early termination)
 * @returns array of JSON objects
 */
export function extractJsons<T = unknown>(
    input: string,
    limit: Limit = "none",
): T[] {
    if (!input.length) {
        return [];
    }

    const locations = generateBracesPrefixAndSufix(input);
    if (!locations.prefix.length || !locations.suffix.length) {
        return [];
    }

    return findValidJsons<T>(locations, input, limit);
}


function findValidJsons<T = unknown>(
    { prefix, suffix }: BraceLocationInfo,
    input: string,
    limit: Limit,
): T[] {
    const jsons: T[] = [];
    let maxRight = -1;

    for (let l = 0; l < prefix.length; l++) {
        const leftPosition = prefix[l]!;

        if (leftPosition <= maxRight) {
            continue;
        }
        for (let r = suffix.length - 1; r >= 0; r--) {
            const rightPosition = suffix[r]!;
            if (rightPosition < leftPosition) {
                continue;
            }
            
            try {
                if (
                    isBalancedWithOneJson(input, leftPosition, rightPosition, limit)
                ) {
                    jsons.push(
                        JSON.parse(input.slice(leftPosition, rightPosition + 1)),
                    );
                    maxRight = rightPosition;
                    break;
                }
            } catch (error) {
                if (!(error instanceof SyntaxError)) {
                    throw error as JsonExtractError;
                }
            }

        }
    }
    return jsons;
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

function generateLimit(input: string, left: number, limit: Limit) {
    switch (limit) {
        case "log2":
            return (
                left +
                Math.min(input.length, Math.ceil(Math.log2(input.length)))
            );
        case "none":
            return input.length;
        default:
            throw new JsonExtractError("unknown limit type provided");
    }
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

        if (inString) {
            continue;
        }

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
