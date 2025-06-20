import { extractHelp } from "./extractHelp.js";

test("extractHelp", () => {
  const lines = [
    "Title A",
    "? webhelp",
    "% https://example.com",
    "? filehelp",
    "% example.js",
    "? texthelp",
    "% This is a text help",
    "? scrapboxhelp",
    "example",
  ];

  const result = extractHelp("Project A", "Title A", lines);

  expect(result).toEqual([
    {
      type: "web",
      url: "https://example.com",
    },
    {
      type: "file",
      project: "Project A",
      title: "Title A",
      fileName: "example.js",
    },
    {
      type: "text",
      text: "This is a text help",
    },
    {
      type: "scrapbox",
      project: "Project A",
      title: "Title A",
    },
  ]);
});
