type BaseHelp = {
  type: string;
  helpfeel: string;
};

type ScrapboxHelp = BaseHelp & {
  type: "scrapbox";
  project: string;
  title: string;
};

type WebHelp = BaseHelp & {
  type: "web";
  url: string;
};

type TextHelp = BaseHelp & {
  type: "text";
  text: string;
};

type FileHelp = BaseHelp & {
  type: "file";
  project: string;
  title: string;
  fileName: string;
};

type TableHelp = BaseHelp & {
  type: "table";
  project: string;
  title: string;
  tableName: string;
};

type Help = ScrapboxHelp | WebHelp | TextHelp | FileHelp | TableHelp;

type Glossary = Map<string, string>;
