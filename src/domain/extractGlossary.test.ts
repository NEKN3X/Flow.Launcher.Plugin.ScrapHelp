import { extractGlossary } from "./extractGlossary.js";

test("extractGlossary", () => {
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

  expect(extractGlossary(lines)).toEqual(expected);
});
