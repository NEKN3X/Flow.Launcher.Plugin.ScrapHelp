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

export function getAllHelp(
  projects: string[],
  getTitles: GetTitles,
  getLines: GetLines
) {
  return Promise.all(
    projects.map(async (project) => {
      const titles = await getTitles(project);
      const pages = await Promise.all(
        titles.map(async (title) => {
          const lines = await getLines(project, title);
          return {
            title,
            help: extractHelp(project, title, lines),
          };
        })
      );
      return { project, pages };
    })
  ) as Promise<SearchHelpResult>;
}
