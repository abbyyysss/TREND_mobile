import api from "./Api";

// ✅ Fetch all regions
export async function fetchRegions() {
  const res = await api.get("/locations/regions/");
  return res.data;
}

// ✅ Fetch provinces (requires region code)
export async function fetchProvinces(regionCode) {
  const res = await api.get("/locations/provinces/", {
    params: { region_code: regionCode },
  });
  return res.data;
}

// ✅ Fetch cities/municipalities (requires region + province codes)
export async function fetchCities(regionCode, provCode) {
  const res = await api.get("/locations/cities-municipalities/", {
    params: { region_code: regionCode, prov_code: provCode },
  });
  return res.data;
}

// ✅ Fetch barangays (from PSGC API)
import axios from "axios";

export async function fetchBarangays(cityOrMunicipalityCode) {
  const url = `https://psgc.gitlab.io/api/cities-municipalities/${cityOrMunicipalityCode}/barangays/`;
  const res = await axios.get(url, { timeout: 10000 }); // 10s timeout for reliability
  return res.data;
}