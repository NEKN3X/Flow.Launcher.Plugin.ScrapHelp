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
