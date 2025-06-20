const apiBaseUrl = "https://scrapbox.io/api";

async function fetchScrapboxApi<T>(endpoint: string, sid?: string) {
  const url = `${apiBaseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(sid ? { Cookie: `connect.sid=${sid}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! ${response.status} - ${response.statusText}`);
  }
  return (await response.json()) as T;
}

export default {
  searchTitles: async (project: string, sid?: string) => {
    const endpoint = `/pages/${project}/search/titles`;
    return fetchScrapboxApi<SearchTitlesResponse>(endpoint, sid);
  },
};
