const apiBaseUrl = "https://scrapbox.io/api";

async function fetchScrapboxApi(endpoint: string, sid?: string) {
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
  return await response.json();
}

export default {
  searchTitles: async (project: string, sid?: string) => {
    const endpoint = `/pages/${project}/search/titles`;
    return fetchScrapboxApi(endpoint, sid);
  },
};
