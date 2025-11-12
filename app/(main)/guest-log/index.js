import { useState } from "react"
import { View, StyleSheet } from "react-native"
import DateInput from "@/components/input/DateInput"
import StatsCard from "@/components/card/StatsCard"
import GuestLogTable from "@/components/table/GuestLogTable"
import GuestLogModal from "@/components/modal/GuestLogModal"
import DefaultButton from "@/components/button/DefaultButton"
import Pagination from "@/components/pagination/Pagination"
import NoResultsText from "@/components/text/NoResultsText"
import LoadingOverlay from "@/components/loading/LoadingOverlay"
import { formatDate } from "@/utils/dateUtils"

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [selectedRow, setSelectedRow] = useState(null)

  const titleTextSize = 13
  const statsTextSize = 32

  // Sample data matching table structure
  const sampleData = [
    {
      id: 1,
      checkInDate: "2025-11-01",
      checkInAt: "2:30 PM",
      room_id: "101",
      noOfGuests: 2,
      lengthOfStay: 2,
    },
    {
      id: 2,
      checkInDate: "2025-11-01",
      checkInAt: "3:15 PM",
      room_id: "102",
      noOfGuests: 1,
      lengthOfStay: 4,
    },
    {
      id: 3,
      checkInDate: "2025-10-28",
      checkInAt: "11:00 AM",
      room_id: "103",
      noOfGuests: 3,
      lengthOfStay: 5,
    },
    {
      id: 4,
      checkInDate: "2025-11-02",
      checkInAt: "1:45 PM",
      room_id: "201",
      noOfGuests: 2,
      lengthOfStay: 2,
    },
    {
      id: 5,
      checkInDate: "2025-11-01",
      checkInAt: "4:20 PM",
      room_id: "202",
      noOfGuests: 4,
      lengthOfStay: 5,
    },
  ]

  const [data, setData] = useState(sampleData)
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(sampleData.length)

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleRowsPerPageChange = (newSize) => {
    setRowsPerPage(newSize)
    setPage(1)
  }

  const openGuestLogModal = (mode, rowId = null) => {
    setModalMode(mode)
    setSelectedRow(rowId)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setSelectedRow(null)
  }

  const today = formatDate(new Date())

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.dateInputWrapper}>
          <DateInput />
        </View>

        <View style={styles.statsGrid}>
          <StatsCard
            titleText="No. of Rooms Available"
            statsText="20"
            percentageText="5%"
            titleTextSize={titleTextSize}
            statsTextSize={statsTextSize}
            isIncreasing={true}
            withPercentage={false}
            helperText={`For ${today}`}
          />
          <StatsCard
            titleText="No. of Guest Check In"
            statsText="133"
            percentageText="2%"
            titleTextSize={titleTextSize}
            statsTextSize={statsTextSize}
            isIncreasing={true}
            withPercentage={false}
            helperText={`For ${today}`}
          />
          <StatsCard
            titleText="No. of Guests Staying Overnight"
            statsText="150"
            percentageText="6%"
            titleTextSize={titleTextSize}
            statsTextSize={statsTextSize}
            isIncreasing={false}
            withPercentage={false}
            helperText={`For ${today}`}
          />
          <StatsCard
            titleText="No. of Rooms Occupied"
            statsText="10"
            percentageText="6%"
            titleTextSize={titleTextSize}
            statsTextSize={statsTextSize}
            isIncreasing={true}
            withPercentage={false}
            helperText={`For ${today}`}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <DefaultButton
            label="+ Create Guest Log"
            fontSize={13}
            paddingVertical={7}
            paddingHorizontal={10}
            fullWidth={false}
            onPress={() => openGuestLogModal("add")}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <LoadingOverlay message="Loading..." />
          </View>
        ) : data.length === 0 ? (
          <NoResultsText />
        ) : (
          <>
            <View style={styles.tableWrapper}>
              <GuestLogTable openGuestLogModal={openGuestLogModal} data={data} loading={loading} />
            </View>

            <View style={styles.paginationWrapper}>
              <Pagination
                count={Math.ceil(totalCount / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </View>
          </>
        )}
      </View>

      <GuestLogModal
        open={modalOpen}
        mode={modalMode}
        rowData={selectedRow}
        data={data}
        setData={setData}
        onClose={handleClose}
        page={page}
        rowsPerPage={rowsPerPage}
        setTotalCount={setTotalCount}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  innerContainer: {
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 25,
    gap: 25,
  },
  dateInputWrapper: {
    flexDirection: 'row',
  },
  statsGrid: {
    width: '100%',
    gap: 20,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'flex-start',
  },
  loadingContainer: {
    position: 'relative',
    height: 200,
  },
  tableWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  paginationWrapper: {
    width: '100%',
    alignItems: 'center',
  },
})