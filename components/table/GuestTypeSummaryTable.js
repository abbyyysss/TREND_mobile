import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/assets/theme/ThemeContext';
import { styles, getThemedStyles } from '@/styles/tableStyles';
import SummaryHelperText from '@/components/text/SummaryHelperText';
import { formatReadableNumber } from '@/utils/numberFormatter';

export default function GuestTypeSummaryTable({ reports, isCheckIn = false }) {
  const { isDark, colors, fonts } = useTheme();
  const themedStyles = getThemedStyles(isDark, colors, fonts);

  const TableWrapper = ({ children }) => (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.scrollView}
      >
        {children}
      </ScrollView>
    </View>
  );

  return (
    <View style={{ gap: 25, alignItems: 'flex-end' }}>
      {/* Philippine Residents Table */}
      <TableWrapper>
        <View style={styles.tableContainer}>
          <View style={[styles.tableHeader, themedStyles.tableHeader]}>
            <View style={[styles.headerCell, styles.checkInDateCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Philippine Residents
              </Text>
            </View>
            {isCheckIn && (
              <>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Male</Text>
                </View>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Female</Text>
                </View>
              </>
            )}
            <View style={[styles.headerCell, styles.noOfGuestsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>Total</Text>
            </View>
          </View>

          <View style={styles.tableBody}>
            {reports.map((row) => (
              <React.Fragment key={row.id}>
                <View style={[styles.tableRow, themedStyles.tableRow]}>
                  <View style={[styles.cell, styles.checkInDateCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      Filipino Nationality
                    </Text>
                  </View>
                  {isCheckIn && (
                    <>
                      <View style={[styles.cell, styles.noOfGuestsCell]}>
                        <Text style={[styles.cellText, themedStyles.cellText]}>
                          {formatReadableNumber(row.philippineMaleGuests)}
                        </Text>
                      </View>
                      <View style={[styles.cell, styles.noOfGuestsCell]}>
                        <Text style={[styles.cellText, themedStyles.cellText]}>
                          {formatReadableNumber(row.philippineFemaleGuests)}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={[styles.cell, styles.noOfGuestsCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(isCheckIn ? row.philippineGuests : row.philippineGuestNights)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.tableRow, themedStyles.tableRow]}>
                  <View style={[styles.cell, styles.checkInDateCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      Foreign Nationality
                    </Text>
                  </View>
                  {isCheckIn && (
                    <>
                      <View style={[styles.cell, styles.noOfGuestsCell]}>
                        <Text style={[styles.cellText, themedStyles.cellText]}>
                          {formatReadableNumber(row.philippineForeignMaleResidents)}
                        </Text>
                      </View>
                      <View style={[styles.cell, styles.noOfGuestsCell]}>
                        <Text style={[styles.cellText, themedStyles.cellText]}>
                          {formatReadableNumber(row.philippineForeignFemaleResidents)}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={[styles.cell, styles.noOfGuestsCell]}>
                    <Text style={[styles.cellText, themedStyles.cellText]}>
                      {formatReadableNumber(isCheckIn ? row.philippineForeignResidents : row.philippineForeignGuestNights)}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>
      </TableWrapper>

      {reports.map((row) => (
        <SummaryHelperText 
          key={row.id} 
          label="Total Philippine Resident" 
          value={formatReadableNumber(isCheckIn ? row.totalPhilippineGuests : row.totalPhilippineGuestNights)} 
          isCheckIn={isCheckIn} 
        />
      ))}

      {/* OFW Table */}
      <TableWrapper>
        <View style={styles.tableContainer}>
          <View style={[styles.tableHeader, themedStyles.tableHeader]}>
            <View style={[styles.headerCell, styles.checkInDateCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Overseas Filipino Workers
              </Text>
            </View>
            {isCheckIn && (
              <>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Male</Text>
                </View>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Female</Text>
                </View>
              </>
            )}
            <View style={[styles.headerCell, styles.noOfGuestsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>Total</Text>
            </View>
          </View>

          <View style={styles.tableBody}>
            {reports.map((row) => (
              <View key={row.id} style={[styles.tableRow, themedStyles.tableRow]}>
                <View style={[styles.cell, styles.checkInDateCell]}>
                  <Text style={[styles.cellText, themedStyles.cellText]}>
                    Overseas Filipino Workers
                  </Text>
                </View>
                {isCheckIn && (
                  <>
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {formatReadableNumber(row.philippineOFWMaleGuests)}
                      </Text>
                    </View>
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {formatReadableNumber(row.philippineOFWFemaleGuests)}
                      </Text>
                    </View>
                  </>
                )}
                <View style={[styles.cell, styles.noOfGuestsCell]}>
                  <Text style={[styles.cellText, themedStyles.cellText]}>
                    {formatReadableNumber(isCheckIn ? row.philippineOFWGuests : row.philippineOFWGuestNights)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </TableWrapper>

      {reports.map((row) => (
        <SummaryHelperText 
          key={row.id} 
          label="Total Overseas Filipino Workers" 
          value={formatReadableNumber(isCheckIn ? row.philippineOFWGuests : row.philippineOFWGuestNights)} 
          isCheckIn={isCheckIn} 
        />
      ))}

      {/* Non-Philippine Residents Table */}
      <TableWrapper>
        <View style={styles.tableContainer}>
          <View style={[styles.tableHeader, themedStyles.tableHeader]}>
            <View style={[styles.headerCell, styles.checkInDateCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Non-Philippine Residents
              </Text>
            </View>
            {isCheckIn && (
              <>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Male</Text>
                </View>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Female</Text>
                </View>
              </>
            )}
            <View style={[styles.headerCell, styles.noOfGuestsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>Total</Text>
            </View>
          </View>

          <View style={styles.tableBody}>
            {reports.length > 0 ? (
              reports.map((row) =>
                row.nationality?.foreigner?.length > 0 ? (
                  row.nationality.foreigner.map((nat, index) => (
                    <View 
                      key={`${row.id}-${nat.country || 'unknown'}-${index}`}
                      style={[styles.tableRow, themedStyles.tableRow]}
                    >
                      <View style={[styles.cell, styles.checkInDateCell]}>
                        <Text style={[styles.cellText, themedStyles.cellText]}>
                          {nat.country || "N/A"}
                        </Text>
                      </View>
                      {isCheckIn && (
                        <>
                          <View style={[styles.cell, styles.noOfGuestsCell]}>
                            <Text style={[styles.cellText, themedStyles.cellText]}>
                              {formatReadableNumber(nat.male_count) ?? 0}
                            </Text>
                          </View>
                          <View style={[styles.cell, styles.noOfGuestsCell]}>
                            <Text style={[styles.cellText, themedStyles.cellText]}>
                              {formatReadableNumber(nat.female_count) ?? 0}
                            </Text>
                          </View>
                        </>
                      )}
                      <View style={[styles.cell, styles.noOfGuestsCell]}>
                        <Text style={[styles.cellText, themedStyles.cellText]}>
                          {formatReadableNumber(isCheckIn ? nat.total ?? 0 : nat.guest_nights)}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View key={`empty-${row.id}`} style={[styles.tableRow, themedStyles.tableRow]}>
                    <View style={[styles.cell, styles.checkInDateCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>N/A</Text>
                    </View>
                    {isCheckIn && (
                      <>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>0</Text>
                        </View>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>0</Text>
                        </View>
                      </>
                    )}
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>0</Text>
                    </View>
                  </View>
                )
              )
            ) : (
              <View style={[styles.tableRow, themedStyles.tableRow]}>
                <View style={[styles.cell, styles.checkInDateCell]}>
                  <Text style={[styles.cellText, themedStyles.cellText]}>N/A</Text>
                </View>
                {isCheckIn && (
                  <>
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>0</Text>
                    </View>
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>0</Text>
                    </View>
                  </>
                )}
                <View style={[styles.cell, styles.noOfGuestsCell]}>
                  <Text style={[styles.cellText, themedStyles.cellText]}>0</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </TableWrapper>

      {reports.length > 0 ? (
        reports.map((row) => {
          const foreignerTotals = row.nationality?.foreigner?.length
            ? row.nationality.foreigner.reduce(
                (acc, nat) => ({
                  male: acc.male + (nat.male_count ?? 0),
                  female: acc.female + (nat.female_count ?? 0),
                  total: acc.total + (isCheckIn ? (nat.total ?? 0) : (nat.guest_nights ?? 0)),
                }),
                { male: 0, female: 0, total: 0 }
              )
            : { male: 0, female: 0, total: 0 };

          return (
            <SummaryHelperText
              key={`foreigner-total-${row.id}`}
              label="Total Non-Philippine Resident"
              value={formatReadableNumber(foreignerTotals.total)}
              isCheckIn={isCheckIn}
            />
          );
        })
      ) : (
        <SummaryHelperText
          key="no-data"
          label="Total Non-Philippine Resident"
          value={0}
          isCheckIn={isCheckIn}
        />
      )}

      {/* Unspecified Residence Table */}
      <TableWrapper>
        <View style={styles.tableContainer}>
          <View style={[styles.tableHeader, themedStyles.tableHeader]}>
            <View style={[styles.headerCell, styles.checkInDateCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Unspecified Residence
              </Text>
            </View>
            {isCheckIn && (
              <>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Male</Text>
                </View>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Female</Text>
                </View>
              </>
            )}
            <View style={[styles.headerCell, styles.noOfGuestsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>Total</Text>
            </View>
          </View>

          <View style={styles.tableBody}>
            {reports.map((row) => (
              <View key={row.id} style={[styles.tableRow, themedStyles.tableRow]}>
                <View style={[styles.cell, styles.checkInDateCell]}>
                  <Text style={[styles.cellText, themedStyles.cellText]}>
                    Unspecified Residence
                  </Text>
                </View>
                {isCheckIn && (
                  <>
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {formatReadableNumber(row.unspecifiedCountryMaleGuests)}
                      </Text>
                    </View>
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {formatReadableNumber(row.unspecifiedCountryFemaleGuests)}
                      </Text>
                    </View>
                  </>
                )}
                <View style={[styles.cell, styles.noOfGuestsCell]}>
                  <Text style={[styles.cellText, themedStyles.cellText]}>
                    {formatReadableNumber(isCheckIn ? row.unspecifiedCountryGuests : row.unspecifiedCountryGuestNights)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </TableWrapper>

      {reports.map((row) => (
        <SummaryHelperText 
          key={row.id} 
          label="Total Unspecified Residence" 
          value={formatReadableNumber(isCheckIn ? row.unspecifiedCountryGuests : row.unspecifiedCountryGuestNights)} 
          isCheckIn={isCheckIn} 
        />
      ))}

      {/* Grand Total Table */}
      <TableWrapper>
        <View style={styles.tableContainer}>
          <View style={[styles.tableHeader, themedStyles.tableHeader]}>
            <View style={[styles.headerCell, styles.checkInDateCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>
                Grand Total {isCheckIn ? 'Guest Check-ins' : 'Guest Nights'}
              </Text>
            </View>
            {isCheckIn && (
              <>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Male</Text>
                </View>
                <View style={[styles.headerCell, styles.noOfGuestsCell]}>
                  <Text style={[styles.headerText, themedStyles.headerText]}>Female</Text>
                </View>
              </>
            )}
            <View style={[styles.headerCell, styles.noOfGuestsCell]}>
              <Text style={[styles.headerText, themedStyles.headerText]}>Total</Text>
            </View>
          </View>

          <View style={styles.tableBody}>
            {reports.map((row) => {
              const foreignerTotals = row.nationality?.foreigner?.length
                ? row.nationality.foreigner.reduce(
                    (acc, nat) => ({
                      male: acc.male + (nat.male_count ?? 0),
                      female: acc.female + (nat.female_count ?? 0),
                      total: acc.total + (isCheckIn ? (nat.total ?? 0) : (nat.guest_nights ?? 0)),
                    }),
                    { male: 0, female: 0, total: 0 }
                  )
                : { male: 0, female: 0, total: 0 };

              return (
                <React.Fragment key={row.id}>
                  <View style={[styles.tableRow, themedStyles.tableRow]}>
                    <View style={[styles.cell, styles.checkInDateCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        Philippine Residents
                      </Text>
                    </View>
                    {isCheckIn && (
                      <>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>
                            {formatReadableNumber(row.totalPhilippineMaleGuests)}
                          </Text>
                        </View>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>
                            {formatReadableNumber(row.totalPhilippineFemaleGuests)}
                          </Text>
                        </View>
                      </>
                    )}
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {formatReadableNumber(isCheckIn ? row.totalPhilippineGuests : row.totalPhilippineGuestNights)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.tableRow, themedStyles.tableRow]}>
                    <View style={[styles.cell, styles.checkInDateCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        Overseas Filipino Workers
                      </Text>
                    </View>
                    {isCheckIn && (
                      <>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>
                            {formatReadableNumber(row.philippineOFWMaleGuests)}
                          </Text>
                        </View>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>
                            {formatReadableNumber(row.philippineOFWFemaleGuests)}
                          </Text>
                        </View>
                      </>
                    )}
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {formatReadableNumber(isCheckIn ? row.philippineOFWGuests : row.philippineOFWGuestNights)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.tableRow, themedStyles.tableRow]}>
                    <View style={[styles.cell, styles.checkInDateCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        Non-Philippine Residents
                      </Text>
                    </View>
                    {isCheckIn && (
                      <>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>
                            {formatReadableNumber(foreignerTotals.male)}
                          </Text>
                        </View>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>
                            {formatReadableNumber(foreignerTotals.female)}
                          </Text>
                        </View>
                      </>
                    )}
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {formatReadableNumber(foreignerTotals.total)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.tableRow, themedStyles.tableRow]}>
                    <View style={[styles.cell, styles.checkInDateCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        Unspecified Residence
                      </Text>
                    </View>
                    {isCheckIn && (
                      <>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>
                            {formatReadableNumber(row.unspecifiedCountryMaleGuests)}
                          </Text>
                        </View>
                        <View style={[styles.cell, styles.noOfGuestsCell]}>
                          <Text style={[styles.cellText, themedStyles.cellText]}>
                            {formatReadableNumber(row.unspecifiedCountryFemaleGuests)}
                          </Text>
                        </View>
                      </>
                    )}
                    <View style={[styles.cell, styles.noOfGuestsCell]}>
                      <Text style={[styles.cellText, themedStyles.cellText]}>
                        {formatReadableNumber(isCheckIn ? row.unspecifiedCountryGuests : row.unspecifiedCountryGuestNights)}
                      </Text>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        </View>
      </TableWrapper>
    </View>
  );
}