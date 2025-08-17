/** @type {import("jest").Config} **/
export default {
  preset: 'ts-jest',
  testEnvironment: "node",
  transform: {
    "^.+\\.m?ts?$": ["ts-jest", {
        useESM: true
    }]
  }
};
