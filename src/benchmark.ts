import { performance } from "node:perf_hooks";
import process from "node:process";
import { extractJsons } from "./extractor.js";

function generateNestedJSON(depth: number): object {
  let obj: any = { value: "test" };
  for (let i = 0; i < depth; i++) {
    obj = { nested: obj };
  }
  return obj;
}

function generateRawString(
  depth: number,
  count: number,
  sizeFactor: number,
): string {
  const jsons = [];
  for (let i = 0; i < count; i++) {
    const base = generateNestedJSON(depth);
    (base as any).padding = "x".repeat(sizeFactor);
    jsons.push(JSON.stringify(base));
  }
  return jsons.join(" some text in between ");
}

function getMemoryUsageMB(): number {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  return Math.round(used * 100) / 100;
}

async function runBenchmark() {
  const depths = [1, 3, 5, 10, 20];
  const sizes = [0, 1000, 10000, 50_000]; // padding sizes
  const counts = [1, 5, 10, 20]; // number of JSONs per string

  for (const depth of depths) {
    for (const size of sizes) {
      for (const count of counts) {
        const input = generateRawString(depth, count, size);

        const memBefore = getMemoryUsageMB();
        const start = performance.now();

        const result = extractJsons(input);

        const end = performance.now();
        const memAfter = getMemoryUsageMB();

        console.log(
          `Depth=${depth}, Size=${size}, Count=${count} | Time=${(end - start).toFixed(3)} ms | ` +
            `MemΔ=${(memAfter - memBefore).toFixed(3)} MB | OutputLen=${JSON.stringify(result).length}`,
        );
      }
    }
  }
}

runBenchmark();
