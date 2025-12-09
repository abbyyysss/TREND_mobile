import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "@/services/Api"
import { formatAEType } from "@/utils/aeTypes"
import { formatDate } from "@/utils/dateUtils"

const STORAGE_KEYS = {
  NATIONALITIES: "monthly_report_nationalities",
}

// AsyncStorage Helpers
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
}

const MonthlyReportService = {
  // Nationalities
  async getNationalities() {
    try {
      const { data } = await api.get("/reports/nationalities/")
      const nationalities = data.map((n) => ({
        id: n.id,
        country: n.country,
      }))

      await storage.save(STORAGE_KEYS.NATIONALITIES, nationalities)
      return nationalities
    } catch (error) {
      console.error("Error fetching nationalities:", error)
      return await storage.load(STORAGE_KEYS.NATIONALITIES)
    }
  },

  async prepareData(formData) {
    const cachedNationalities = await storage.load(STORAGE_KEYS.NATIONALITIES)

    return {
      month: formData.month,
      ae_profile_id: typeof formData.ae_profile === "object"
        ? formData.ae_profile?.id
        : formData.ae_profile,

      philippine_guests: Number(formData.philippine_guests) || 0,
      philippine_guest_nights: Number(formData.philippine_guest_nights) || 0,
      foreign_guests: Number(formData.foreign_guests) || 0,
      foreign_guest_nights: Number(formData.foreign_guest_nights) || 0,
      philippine_ofw_guests: Number(formData.philippine_ofw_guests) || 0,
      philippine_ofw_nights: Number(formData.philippine_ofw_nights) || 0,
      rooms_occupied: Number(formData.rooms_occupied) || 0,
      nationalities: (formData.nationalities || []).map((nat) => {
        const match = cachedNationalities.find((n) => n.country === nat.nationality)
        return {
          nationality: match ? match.id : null,
          male_count: Number(nat.male_count) || 0,
          female_count: Number(nat.female_count) || 0,
          total:
            Number(nat.total_count) ||
            (Number(nat.male_count) || 0) + (Number(nat.female_count) || 0),
          filipino_subcategory: nat.filipino_subcategory || null,
        }
      }),
    }
  },

  // Submit Monthly Report
  async submit(formData, reportMode = "monthly", id = null) {
    try {
      await Promise.all([this.getNationalities()])

      const payload = await this.prepareData(formData)
      const endpoint = "/reports/monthlyreports/"
      const url = id ? `${endpoint}${id}/` : endpoint
      console.log("Submitting monthly report payload:", payload)

      const response = id ? await api.put(url, payload) : await api.post(url, payload)

      console.log(`${reportMode.toUpperCase()} monthly report submission success:`, response.data)
      return response.data
    } catch (error) {
      console.error(`Error submitting monthly report:`, error)
      throw error
    }
  },

  // Fetch Guest Metrics
  async fetchGuestMetrics(params = {}) {
    try {
      const { data } = await api.get("/reports/guest-metrics/", { params })
      return data
    } catch (error) {
      console.error("Error fetching guest metrics:", error)
      throw error
    }
  },

  // Fetch Monthly Reports (list)
  async fetchMonthlyReports(params = {}) {
    try {
      const { data } = await api.get("/reports/monthlyreports/", { params })
      console.log("Monthly reports data:", data)
      return data
    } catch (error) {
      console.error("Error fetching monthly reports:", error)
      throw error
    }
  },

  // Fetch Monthly Report by ID (details)
  async fetchMonthlyReportById(roomId) {
    try {
      const response = await api.get(`/reports/monthlyreports/${roomId}`)
      if (response.status === 200) return response.data
      throw new Error(`HTTP error! status: ${response.status}`)
    } catch (error) {
      console.error(`Error fetching guest log ${roomId}:`, error)
      throw error
    }
  },

  // Fetch Merged Reports
  async fetchMergedReports(params = {}) {
    const { id, date, ...rest } = params
    const query = id ? { ae_profile: id, ...rest } : rest

    if (date) {
      const [year, month] = date.split("-")
      query.year = Number.parseInt(year, 10)
      query.month = Number.parseInt(month, 10)
    }

    const { page, page_size, ...metricsQuery } = query

    const [reportData, metricsData] = await Promise.all([
      this.fetchMonthlyReports(query),
      this.fetchGuestMetrics(metricsQuery),
    ])

    const results = reportData.results || []
    const metrics = Array.isArray(metricsData) ? metricsData : metricsData.results || []

    const metricsLookup = {}
    metrics.forEach((m) => {
      const key = `${m.ae_profile}|${m.month}`
      metricsLookup[key] = m
    })

    const mapped = results.map((item) => {
      const aeId = typeof item.ae_profile === "string" ? item.ae_profile : item.ae_profile?.id
      const key = `${aeId}|${item.month}`
      const metric = metricsLookup[key]

      let foreignerBreakdown = []

      if (Array.isArray(item.nationality_breakdown)) {
        foreignerBreakdown = item.nationality_breakdown.filter(
          (nat) =>
            nat.country !== "Philippines" &&
            (nat.filipino_subcategory === "Foreigner" || nat.filipino_subcategory === null),
        )
      }

      // Format status properly
      let formattedStatus = "N/A"
      if (item.status) {
        formattedStatus = item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()
      }

      return {
        id: item.id,
        ae_id: aeId,
        aeName: item.ae_profile?.establishment_name || "N/A",
        date: item.month,
        monthYear: item.month
          ? new Date(item.month).toLocaleString("en-PH", {
              year: "numeric",
              month: "long",
            })
          : "N/A",
        month: item.month ? new Date(item.month).toLocaleString("en-PH", { month: "long" }) : "N/A",
        year: item.month ? new Date(item.month).getFullYear() : null,
        totalGuests: item.total_guests || 0,
        totalPhilippineGuests: item.philippine_guests || 0,
        totalPhilippineMaleGuests: item.philippine_male_guests || 0,
        totalPhilippineFemaleGuests: item.philippine_female_guests || 0,
        philippineGuests: item.philippine_non_ofw || 0,
        philippineMaleGuests: item.philippine_non_ofw_male_guests || 0,
        philippineFemaleGuests: item.philippine_non_ofw_female_guests || 0,
        philippineForeignResidents: item.philippine_foreign_residents || 0,
        philippineForeignMaleResidents: item.philippine_foreign_residents_male || 0,
        philippineForeignFemaleResidents: item.philippine_foreign_residents_female || 0,
        philippineOFWGuests: item.philippine_ofw_guests || 0,
        philippineOFWMaleGuests: item.philippine_ofw_male_guests || 0,
        philippineOFWFemaleGuests: item.philippine_ofw_female_guests || 0,
        unspecifiedCountryGuests: item.unspecified_country_guests || 0,
        unspecifiedCountryMaleGuests: item.unspecified_country_male_guests || 0,
        unspecifiedCountryFemaleGuests: item.unspecified_country_female_guests || 0,
        foreignGuests: item.foreign_guests || 0,
        nationality: {
          foreigner: foreignerBreakdown,
        },
        totalGuestNights: item.total_guest_nights || "0",
        foreignGuestNights: item.foreign_guest_nights || "0",
        totalPhilippineGuestNights: item.philippine_guest_nights || 0,
        philippineGuestNights: item.philippine_non_ofw_guest_nights || 0,
        philippineForeignGuestNights: item.philippine_foreign_residents_nights || 0,
        philippineOFWGuestNights: item.philippine_ofw_nights || 0,
        unspecifiedCountryGuestNights: item.unspecified_country_guest_nights || 0,
        availableRooms: item.available_rooms || 0,
        avgOccupancyRate: metric?.avg_occupancy_rate ? Math.round(metric.avg_occupancy_rate * 100) / 100 : 0,
        avgLengthOfStay: metric?.avg_length_of_stay ? Math.round(metric.avg_length_of_stay * 100) / 100 : 0,
        roomsOccupied: metric?.rooms_occupied || 0,
        profilePhoto: item.ae_profile?.profile_photo || "/assets/Profile/default-profile-photo.png",
        coverPhoto: item.ae_profile?.cover_photo || "/assets/Profile/default-cover-photo.png",
        address: [item.ae_profile?.city_municipality, item.ae_profile?.province].filter(Boolean).join(", "),
        type: formatAEType(item.ae_profile?.type),
        isAccredited: item.ae_profile?.accreditation_status,
        reportMode: item.ae_profile?.report_mode,
        status: formattedStatus,
        dateSubmitted: item.date_submitted || "N/A",
      }
    })

    return {
      mapped,
      count: reportData.count || 0,
    }
  },

  // Export Reports (Download)
  async exportReports({ period, aeid = null } = {}) {
    try {
      if (!period) {
        throw new Error("Period parameter is required (e.g., 2025-10-1)")
      }

      // Build query params
      const params = { period }

      // Only include aeid if provided (AE users will not pass it)
      if (aeid) params.aeid = aeid

      const response = await api.get("/reports/export/", {
        params,
        responseType: "blob", // Important for downloading files
      })

      return response.data // blob file
    } catch (error) {
      console.error("Error exporting reports:", error)
      throw error
    }
  },

  // ============================
  // 📌 DAILY BREAKDOWN
  // Endpoint: /reports/checkins-daily-breakdown/
  // Params: { month, year, aeid? }
  // ============================
  async fetchDailyBreakdown(params = {}) {
    try {
      console.log("Fetching DAILY BREAKDOWN with params:", params)

      const { data } = await api.get("/reports/checkins-daily-breakdown/", { params })

      console.log("DAILY BREAKDOWN response:", data)
      return data
    } catch (error) {
      console.error("Error fetching daily breakdown:", error)
      throw error
    }
  },

  // ============================
  // 📌 OCCUPIED ROOMS
  // Endpoint: /reports/occupied-rooms/
  // Params: { date, aeid? }
  // ============================
  async fetchOccupiedRooms(params = {}) {
    try {
      console.log("Fetching OCCUPIED ROOMS with params:", params)

      const { data } = await api.get("/reports/occupied-rooms/", { params })

      console.log("OCCUPIED ROOMS response:", data)
      return data
    } catch (error) {
      console.error("Error fetching occupied rooms:", error)
      throw error
    }
  },
}

export const fetchAllMergedReports = async (params = {}) => {
  let allResults = [];
  let page = 1;
  let next = true;

  while (next) {
    console.log(`Fetching page ${page}...`);
    const res = await MonthlyReportService.fetchMergedReports({ ...params, page, page_size: 100 });

    const mapped = res?.mapped || [];
    allResults = [...allResults, ...mapped];

    // Stop when no more pages
    if (res?.next) {
      page++;
    } else {
      next = false;
    }
  }

  return allResults;
};

export const fetchMergedReports = MonthlyReportService.fetchMergedReports.bind(MonthlyReportService)
export default MonthlyReportService