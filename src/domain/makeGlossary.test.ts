import { makeGlossary } from "./makeGlossary.js";

test("makeGlossary", () => {
  const lines = [
    "term1: `definition1`",
    "term2: `definition2`",
    "term3: `definition3`",
  ];

  const expected = new Map([
    ["term1", "definition1"],
    ["term2", "definition2"],
    ["term3", "definition3"],
  ]);

  expect(makeGlossary(lines)).toEqual(expected);
});
