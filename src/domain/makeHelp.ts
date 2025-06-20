export function makeHelp(
  project: string,
  title: string,
  lines: string[]
): Help[] {
  return lines.map((line, index) => {
    const nextLine = lines[index + 1] || "";

    return {
      type: "scrapbox",
      project: project,
      title: title,
    };
  });
}
