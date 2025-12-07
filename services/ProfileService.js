// services/ProfileService.js
import api from './Api';

export async function getProfileById(profileId) {
  try {
    // 🔎 First get profile by ID
    const profileRes = await api.get(`/accounts/profiles/${profileId}/`);
    const profile = profileRes.data;

    // 🔁 Then get full user data by user.id
    const userId = profile.user.id;
    const userRes = await api.get(`/accounts/users/${userId}/`);

    return { ok: true, data: userRes.data };
  } catch (err) {
    const status = err?.response?.status ?? 0;
    return { ok: false, status, error: err?.response?.data };
  }
}
