export type SearchHelpResult = {
  title: string;
  subtitle: string;
  help: Help;
};

export function searchHelp(): Promise<SearchHelpResult[]> {
  return Promise.resolve([]);
}
