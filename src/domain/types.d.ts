type Settings = {
  sid: string;
  projects: string[];
};

type ScrapboxHelp = {
  type: "scrapbox";
  project: string;
  title: string;
};

type WebHelp = {
  type: "web";
  url: string;
};

type TextHelp = {
  type: "text";
  text: string;
};

type FileHelp = {
  type: "file";
  project: string;
  title: string;
  fileName: string;
};

type TableHelp = {
  type: "table";
  project: string;
  title: string;
  tableName: string;
};

type Help = ScrapboxHelp | WebHelp | TextHelp | FileHelp | TableHelp;

type Glossary = Map<string, string>;
