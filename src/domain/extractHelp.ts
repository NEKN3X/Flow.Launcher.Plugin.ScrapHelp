const helpfeel = /^\s*\?\s+(.*)$/;
const urlHelpRegex = /^\s*(\%|\$)\s+(https?.+)$/;
const fileHelpRegex = /^\s*(\%|\$)\s+(.+\.(.+))$/;
const textHelpRegex = /^\s*(\%|\$)\s+(.+)$/;

function makeWebHelp(helpfeel: string, nextLine: string): WebHelp | null {
  const match = nextLine.match(urlHelpRegex);
  if (!match) return null;
  return {
    type: "web",
    url: match[2],
    helpfeel,
  };
}

function makeFileHelp(
  helpfeel: string,
  project: string,
  title: string,
  line: string
): FileHelp | null {
  const match = line.match(fileHelpRegex);
  if (!match) return null;
  return {
    type: "file",
    project: project,
    title: title,
    fileName: match[2],
    helpfeel,
  };
}

function makeTextHelp(helpfeel: string, line: string): TextHelp | null {
  const match = line.match(textHelpRegex);
  if (!match) return null;
  return {
    type: "text",
    text: match[2],
    helpfeel,
  };
}

export function extractHelp(
  project: string,
  title: string,
  lines: string[]
): Help[] {
  return lines.reduce((acc, line, index) => {
    const helpfeelMatch = line.match(helpfeel);
    if (!helpfeelMatch) return acc;
    const nextLine = lines[index + 1] || "";

    const webHelp = makeWebHelp(helpfeelMatch[1], nextLine);
    if (webHelp) return [...acc, webHelp];

    const fileHelp = makeFileHelp(helpfeelMatch[1], project, title, nextLine);
    if (fileHelp) return [...acc, fileHelp];

    const textHelp = makeTextHelp(helpfeelMatch[1], nextLine);
    if (textHelp) return [...acc, textHelp];

    return [
      ...acc,
      {
        type: "scrapbox",
        project: project,
        title: title,
        helpfeel: helpfeelMatch[1],
      },
    ];
  }, [] as Help[]);
}
