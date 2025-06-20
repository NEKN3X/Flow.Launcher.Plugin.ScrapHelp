const apiBaseURL = "https://scrapbox.io/api";

async function fetchScrapboxApi(endpoint: string, sid?: string) {
  const response = await fetch(`${apiBaseURL}${endpoint}`, {
    headers: {
      ...(sid ? { Cookie: `connect.sid=${sid}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! ${response.status} - ${response.statusText}`);
  }
  return response;
}

export const scrapboxApi = {
  searchTitles: async (project: string, sid?: string) => {
    const endpoint = `/pages/${project}/search/titles`;
    return fetchScrapboxApi(endpoint, sid).then(
      async (response) => (await response.json()) as SearchTitlesResponse
    );
  },
  pageText: async (project: string, title: string, sid?: string) => {
    const endpoint = `/pages/${project}/${encodeURIComponent(title)}/text`;
    return fetchScrapboxApi(endpoint, sid)
      .then(async (response) => (await response.text()) as PageTextResponse)
      .then((text) => text.split("\n"));
  },
};
