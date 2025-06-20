import { makeHelp } from "./makeHelp.js";

test("makeHelp", () => {
  const lines = ["Project A"];

  const result = makeHelp("Project A", "Title A", lines);

  expect(result).toEqual([
    {
      type: "scrapbox",
      project: "Project A",
      title: "Title A",
    },
  ]);
});
