import API from "./api";

export async function fetchVehicles() {
  const response = await fetch(`${API}/vehicles`);

  if (!response.ok) {
    throw new Error("Unable to fetch vehicles");
  }

  return response.json();
}

export async function fetchVehicleETAs(vehicleId) {
  const response = await fetch(`${API}/vehicles/${vehicleId}/etas`);

  if (!response.ok) {
    throw new Error("Unable to fetch ETAs");
  }

  return response.json();
}

export async function fetchVehicleETA(vehicleId, stopId) {
  const response = await fetch(`${API}/vehicles/${vehicleId}/eta/${stopId}`);

  if (!response.ok) {
    throw new Error("Unable to fetch ETA");
  }

  return response.json();
}
