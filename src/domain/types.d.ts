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

type CommandHelp = {
  type: "command";
  command: string;
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

type Help = ScrapboxHelp | WebHelp | CommandHelp | FileHelp | TableHelp;
