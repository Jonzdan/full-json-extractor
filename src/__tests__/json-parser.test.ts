import { extractJsons } from "../extractor";

describe("extractJsonIntervals.test", () => {
  it("only json, valid json, 1-depth", () => {
    const testData = `{"sample_id": 1, "data": { "key": "xdsc" }}`;
    const expectedData = [
      {
        sample_id: 1,
        data: {
          key: "xdsc",
        },
      },
    ];

    expect(extractJsons(testData)[0]).toEqual(expectedData[0]);
  });

  it("only json, invalid json, 0-depth", () => {
    const testData = "{key: 1}";
    expect(extractJsons(testData)).toEqual([]);
  });

  it("raw string, invalid json, 2-depth", () => {
    const testData = '[hi] { "outer": { "inner": { key: 1 } } }';
    expect(extractJsons(testData)).toEqual([]);
  });

  it("raw string, valid json, 1-depth", () => {
    const testData = `[hi] {"sample_id": 1, "data": { "key": "xdsc" }}`;
    const expectedData = [
      {
        sample_id: 1,
        data: {
          key: "xdsc",
        },
      },
    ];

    expect(extractJsons(testData)[0]).toEqual(expectedData[0]);
  });

  it("raw string, valid escaped json, 1-depth", () => {
    const testData = `[hi] "{\"sample_id\": 1, \"data\": { \"key\": \"xdsc\" }}"`;
    const expectedData = [
      {
        sample_id: 1,
        data: {
          key: "xdsc",
        },
      },
    ];

    expect(extractJsons(testData)[0]).toEqual(expectedData[0]);
  });

  it("raw string, valid json, 1-depth, 3 objects", () => {
    const testData = `[hi] {"sample_id": 1, "data": { "key": "xdsc" }} {"sample_id": 2, "data": { "key": "xdsc" }} {"sample_id": 3, "data": { "key": "xdsc" }}`;
    const expectedData = [
      {
        sample_id: 1,
        data: {
          key: "xdsc",
        },
      },
      {
        sample_id: 2,
        data: {
          key: "xdsc",
        },
      },
      {
        sample_id: 3,
        data: {
          key: "xdsc",
        },
      },
    ];

    const result = extractJsons(testData);
    for (let i = 0; i < expectedData.length; i++) {
      expect(result).toContainEqual(expectedData[i]);
    }
  });

  it("raw string, valid json, 1-depth, 3 objects, extra {", () => {
    const testData = `[hi] {{"sample_id": 1, "data": { "key": "xdsc" }} {"sample_id": 2, "data": { "key": "xdsc" }} {"sample_id": 3, "data": { "key": "xdsc" }}`;
    const expectedData = [
      {
        sample_id: 1,
        data: {
          key: "xdsc",
        },
      },
      {
        sample_id: 2,
        data: {
          key: "xdsc",
        },
      },
      {
        sample_id: 3,
        data: {
          key: "xdsc",
        },
      },
    ];

    const result = extractJsons(testData);
    for (let i = 0; i < expectedData.length; i++) {
      expect(result).toContainEqual(expectedData[i]);
    }
  });

  it("raw string, valid json, 1-depth, 3 objects, extra {, {} in string", () => {
    const testData = `[hi] {{"sample_id": 1, "data": { "key": "x}dsc" }} {"sample_id": 2, "data": { "key": "xd{sc" }} {"sample_id": 3, "data": { "key": "xdsc" }}`;
    const expectedData = [
      {
        sample_id: 1,
        data: {
          key: "x}dsc",
        },
      },
      {
        sample_id: 2,
        data: {
          key: "xd{sc",
        },
      },
      {
        sample_id: 3,
        data: {
          key: "xdsc",
        },
      },
    ];

    const result = extractJsons(testData);
    for (let i = 0; i < expectedData.length; i++) {
      expect(result).toContainEqual(expectedData[i]);
    }
  });

  it("raw string, valid json, 2-depth, 150 objects, extra {, {} in string", () => {
    const testData: string[] = [];
    for (let i = 0; i < 150; i++) {
      testData.push(
        `[hi] {{"sample_id": ${i}, "data": { "key": "x}ds{c", "subdata": { "key": 2 }}}`,
      );
    }

    const expectedData: object[] = [];
    for (let i = 0; i < 150; i++) {
      expectedData.push({
        sample_id: i,
        data: {
          key: "x}ds{c",
          subdata: {
            key: 2,
          },
        },
      });
    }

    const testDataString = testData.join("");
    const result = extractJsons(testDataString);
    expect(result.length).toEqual(150);
    for (let i = 0; i < expectedData.length; i++) {
      expect(result).toContainEqual(expectedData[i]);
    }
  });
});
