import { getToken } from "./auth";

export async function apiFetch(url: string, options: any = {}) {
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
