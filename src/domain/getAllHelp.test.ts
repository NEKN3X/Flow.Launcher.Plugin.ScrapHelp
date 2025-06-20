import { getAllHelp } from "./getAllHelp.js";

test("getAllHelp", async () => {
  const mockGetTitles = () => Promise.resolve(["Title1", "Title2"]);
  const mockGetLines = () =>
    Promise.resolve(["? webhelp{scrapbox}", "% https://example.com"]);

  const projects = ["Project1"];

  const glossary = new Map<string, string>();
  glossary.set("scrapbox", "(scrapbox|cosense)");

  const result = await getAllHelp(
    projects,
    mockGetTitles,
    mockGetLines,
    glossary
  );
  expect(result).toEqual([
    {
      project: "Project1",
      pages: [
        {
          title: "Title1",
          help: [
            {
              type: "web",
              url: "https://example.com",
              helpfeel: "webhelp(scrapbox|cosense)",
            },
          ],
        },
        {
          title: "Title2",
          help: [
            {
              type: "web",
              url: "https://example.com",
              helpfeel: "webhelp(scrapbox|cosense)",
            },
          ],
        },
      ],
    },
  ]);
});
