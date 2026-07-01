import API from "./api";

export async function fetchAlerts() {
  const response = await fetch(`${API}/alerts`);

  if (!response.ok) {
    throw new Error("Unable to fetch alerts");
  }

  return response.json();
}
