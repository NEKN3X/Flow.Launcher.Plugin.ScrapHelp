import { extractHelp } from "./extractHelp.js";

export type GetTitles = (project: string) => Promise<string[]>;
export type GetLines = (project: string, title: string) => Promise<string[]>;

export type SearchHelpResult = {
  project: string;
  pages: {
    title: string;
    help: Help[];
  }[];
}[];

export function replaceGlossary(text: string, glossary: Glossary) {
  return text.replace(/\{(.*)\}/g, (match, p1) => {
    return glossary.get(p1) || match;
  });
}

export function getAllHelp(
  projects: string[],
  getTitles: GetTitles,
  getLines: GetLines,
  glossary: Glossary
) {
  return Promise.all(
    projects.map(async (project) => {
      const titles = await getTitles(project);
      const pages = await Promise.all(
        titles.map(async (title) => {
          const lines = await getLines(project, title);
          const help = extractHelp(project, title, lines);
          return {
            title,
            help: help.map((h) => ({
              ...h,
              helpfeel: replaceGlossary(h.helpfeel, glossary),
            })),
          };
        })
      );
      return { project, pages };
    })
  ) as Promise<SearchHelpResult>;
}
