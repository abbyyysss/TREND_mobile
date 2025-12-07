import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "@/services/Api";
import { formatDate, formatTime } from "@/utils/dateUtils";

const STORAGE_KEYS = {
  NATIONALITIES: "guestlog_nationalities",
  ROOM_TYPES: "guestlog_room_types",
};

// ---------------------------
// AsyncStorage Helpers
// ---------------------------
const storage = {
  async save(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to AsyncStorage:', error);
    }
  },
  async load(key, fallback = []) {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (cached) return JSON.parse(cached);
    } catch (error) {
      console.error('Error loading from AsyncStorage:', error);
    }
    return fallback;
  },
};

const GuestLogService = {
  // ---------------------------
  // Room Types
  // ---------------------------
  async getRoomTypes(role = "AE") {
    if (role !== "AE") {
      // Non-AE: just use cached values
      return await storage.load(STORAGE_KEYS.ROOM_TYPES);
    }

    try {
      const { data } = await api.get("/ae/room-types/");
      const roomTypes = data.map((room) => ({
        id: room.id,
        room_name: room.room_name,
        min: room.min,
        max: room.max,
        ae: room.ae,
      }));

      await storage.save(STORAGE_KEYS.ROOM_TYPES, roomTypes);
      return roomTypes;
    } catch (error) {
      console.error("Error fetching room types:", error);
      return await storage.load(STORAGE_KEYS.ROOM_TYPES);
    }
  },

  // ---------------------------
  // Nationalities
  // ---------------------------
  async getNationalities() {
    try {
      const { data } = await api.get("/reports/nationalities/");
      const nationalities = data.map((n) => ({
        id: n.id,
        country: n.country,
      }));

      await storage.save(STORAGE_KEYS.NATIONALITIES, nationalities);
      return nationalities;
    } catch (error) {
      console.error("Error fetching nationalities:", error);
      return await storage.load(STORAGE_KEYS.NATIONALITIES);
    }
  },

  // ---------------------------
  // Prepare Payload
  // ---------------------------
  async prepareData(formData) {
    const today = new Date().toISOString().split("T")[0];
    const cachedNationalities = await storage.load(STORAGE_KEYS.NATIONALITIES);

    return {
      check_in_date: formData.check_in_date || today,
      ae_profile: formData.ae_profile,
      room_id: formData.room_id,
      room_type: formData.room_type || null,
      number_of_nights: Number(formData.number_of_nights) || 1,
      nationalities: (formData.nationalities || []).map((nat) => {
        const match = cachedNationalities.find((n) => n.country === nat.nationality);
        return {
          nationality: match ? match.id : null,
          male_count: Number(nat.male_count) || 0,
          female_count: Number(nat.female_count) || 0,
          filipino_subcategory: nat.filipino_subcategory || null,
        };
      }),
    };
  },

  // ---------------------------
  // Submit / Edit Report
  // ---------------------------
  async submit(formData, reportMode = "daily", id = null) {
    try {
      // Ensure cached values are up to date
      await Promise.all([this.getNationalities(), this.getRoomTypes()]);

      const payload = await this.prepareData(formData);
      const endpoint = "/reports/checkins/";
      const url = id ? `${endpoint}${id}/` : endpoint;
      console.log("Submitting payload:", payload);
      
      const response = id
        ? await api.put(url, payload)
        : await api.post(url, payload);

      console.log(`${reportMode.toUpperCase()} submission success:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error submitting ${reportMode} report:`, error);
      throw error;
    }
  },

  // ---------------------------
  // Remove Nationality
  // ---------------------------
  async removeNationality(logId, nationId) {
    return api.delete(`/guestlogs/${logId}/nationalities/${nationId}/`);
  },

  // ---------------------------
  // Fetch Guest Logs (list)
  // ---------------------------
  async fetchGuestLogs(page = 1, pageSize = 5, mode = "daily", date = null) {
    try {
      const { data } = await api.get("/reports/checkins/", {
        params: {
          page,
          page_size: pageSize,
          mode,
          date,
        },
      });

      console.log("API Response:", data);

      return {
        results: (data.results || []).map((item) => ({
          id: item.id,
          room_id: item.room_id,
          checkInDate: formatDate(item.check_in_date),
          checkInAt: formatTime(item.check_in_at),
          noOfGuests: item.total_guests || 0,
          lengthOfStay: item.number_of_nights || 0,
        })),
        count: data.count || 0,
      };
    } catch (error) {
      console.error("Error fetching guest logs:", error);
      throw error;
    }
  },

  // ---------------------------
  // Fetch Check-ins KPIs
  // ---------------------------
  async fetchCheckinKPIs(mode = "daily", date = null) {
    try {
      const { data } = await api.get("/reports/checkins-kpis/", {
        params: {
          mode,
          date,
        },
      });

      console.log("Check-ins KPIs:", data);

      return {
        checkInGuests: data.checkin_guests || 0,
        roomsAvailable: data.rooms_available || 0,
        roomsOccupied: data.rooms_occupied || 0,
        guestNights: data.guest_nights || 0,
      };
    } catch (error) {
      console.error("Error fetching Check-ins KPIs:", error);
      throw error;
    }
  },

  // ---------------------------
  // Fetch Guest Log by ID (details)
  // ---------------------------
  async fetchGuestLogById(roomId) {
    try {
      const response = await api.get(`/reports/checkins/${roomId}`);
      if (response.status === 200) return response.data;
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error(`Error fetching guest log ${roomId}:`, error);
      throw error;
    }
  },

  // ---------------------------
  // Delete Guest Log
  // ---------------------------
  async deleteGuestLog(logId) {
    try {
      const url = `/reports/checkins/${logId}/`;
      const response = await api.delete(url);
      console.log(`Deleted guest log ${logId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting guest log ${logId}:`, error);
      throw error;
    }
  },
};

export default GuestLogService;