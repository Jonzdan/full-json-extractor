# Robust Top-Level JSON Extractor

## Overview

This library only extracts all **highest-level valid JSON objects** from noisy or malformed text streams. It is designed to handle input where JSON objects may be embedded in extra braces, log headers, or partially malformed data, while still guaranteeing that extracted objects are parseable by `JSON.parse`.

This package is meant to be used with payloads under 1MB with somewhat reasonably shaped JSON data, as worst-case time complexity is O(n^3), despite pruning techniques.

---

## Features

- Extracts multiple valid top-level JSON objects from a single string.
- Ignores unmatched braces, extra characters, or malformed sections.
- Works with escaped quotes inside JSON strings.
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
extractJsons(input: string, limit: Limit = "none"): object[]
```

Wrapper for Internal BFS/memoization routine to find all valid JSON intervals.
