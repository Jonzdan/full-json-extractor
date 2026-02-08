# Robust Top-Level JSON Extractor

## Overview

This library only extracts all **highest-level valid JSON objects** from noisy or malformed text streams. It is designed to handle input where JSON objects may be embedded in extra braces, log headers, or partially malformed data, while still guaranteeing that extracted objects are parseable by `JSON.parse`.

This package is meant to be used with payloads under 1MB with somewhat reasonably shaped JSON data, as worst-case time complexity is O(n^3), despite pruning techniques.

---

## Features

- Extracts multiple valid top-level JSON objects from a single string.
- Ignores unmatched braces, extra characters, or malformed sections.
- Works with escaped characters quotes (e.g. "{") inside JSON strings.
- Returns list of jsons derived from original input.

---

## Installation

```bash
npm install full-json-extractor
```

---

## Usage

```
import { extractJsons } from 'full-json-extractor';

const rawString = `[log header] { "id": 1, "data": { "key": "value" } } more text`;
const jsonObjects = extractJsons(rawString);

console.log(jsonObjects);
// Output: [{ id: 1, data: { key: 'value' } }]
```

---

## API

```
extractJsons<T = unknown>(input: string, limit: Limit = "none"): T[]
```

Wrapper for Internal BFS/memoization routine to find all valid JSON intervals.

---

## Benchmarks

Node Version: v22.14.0
CPU: AMD Ryzen 7 5700X

- Depth=3, Size=10000, Count=10   | Time=5.775 ms   | MemΔ=0.390 MB  | OutputLen=100631
- Depth=3, Size=500000, Count=20  | Time=804.766 ms | MemΔ=9.650 MB  | OutputLen=10001261
- Depth=10, Size=50000, Count=10  | Time=53.828 ms  | MemΔ=2.080 MB  | OutputLen=501401
- Depth=10, Size=500000, Count=10 | Time=528.220 ms | MemΔ=1.260 MB  | OutputLen=5001401
- Depth=20, Size=10000, Count=20  | Time=118.182 ms | MemΔ=7.090 MB  | OutputLen=205001
- Depth=20, Size=500000, Count=10 | Time=972.444 ms | MemΔ=10.190 MB | OutputLen=5002501

Depth = Level of nesting per json object 
Size = Padding size per json object
Count = # of actual json objects

