type ResultItem = {
  title: string;
  subTitle?: string;
  jsonRPCAction: {
    method: string;
    parameters: any[];
  };
};
