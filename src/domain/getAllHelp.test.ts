import { getAllHelp } from "./getAllHelp.js";

test("getAllHelp", async () => {
  const mockGetTitles = () => Promise.resolve(["Title1", "Title2"]);
  const mockGetLines = () =>
    Promise.resolve(["? webhelp", "% https://example.com"]);

  const projects = ["Project1"];

  const result = await getAllHelp(projects, mockGetTitles, mockGetLines);
  expect(result).toEqual([
    {
      project: "Project1",
      pages: [
        {
          title: "Title1",
          help: [{ type: "web", url: "https://example.com" }],
        },
        {
          title: "Title2",
          help: [{ type: "web", url: "https://example.com" }],
        },
      ],
    },
  ]);
});
