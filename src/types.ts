export type Query = {
  rawQuery: string;
  isReQuery: boolean;
  isHomeQuery: boolean;
  search: string;
  searchTerms: string[];
  actionKeyword: string;
};

export type Settings = {
  sid: string;
  projects: string;
};
