import api from "./Api"
// ================== AE ROOM TYPES ==================

// Get all room types for the logged-in AE
export const getAERoomTypes = () =>
  api.get("/ae/room-types/").then((res) => res.data)

// Add a new room type
export const addAERoomType = (payload) =>
  api.post("/ae/room-types/", payload).then((res) => res.data)

// Update an existing room type (PATCH)
export const updateAERoomType = (roomTypeId, payload) =>
  api.patch(`/ae/room-types/${roomTypeId}/`, payload).then((res) => res.data)

// Delete a room type
export const deleteAERoomType = (roomTypeId) =>
  api.delete(`/ae/room-types/${roomTypeId}/`).then((res) => res.data)