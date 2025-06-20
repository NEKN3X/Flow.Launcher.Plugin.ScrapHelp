type ResultItem = {
  title: string;
  subTitle?: string;
  glyph?: {
    glyph: string;
    fontFamily: string;
  };
  icoPath?: string;
  jsonRPCAction: {
    method: string;
    parameters: any[];
  };
};

type GetFile = (
  project: string,
  title: string,
  fileName: string
) => Promise<string>;
