export type OpenUrlHelp = {
  type: "open";
  url: string;
};

export type CopyTextHelp = {
  type: "copy";
  text: string;
};

export type Help = OpenUrlHelp | CopyTextHelp;

export type SearchHelpResult = {
  title: string;
  subtitle: string;
  help: Help;
};

export function searchHelp(): Promise<SearchHelpResult[]> {
  return Promise.resolve([]);
}
