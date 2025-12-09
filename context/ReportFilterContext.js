import React, { createContext, useContext, useState } from 'react';

const ReportFilterContext = createContext(null);

export function ReportFilterProvider({ children, defaultValue = 'Daily Breakdown' }) {
  const [activeFilter, setActiveFilter] = useState(defaultValue);
  
  return (
    <ReportFilterContext.Provider value={{ activeFilter, setActiveFilter }}>
      {children}
    </ReportFilterContext.Provider>
  );
}

export function useReportFilter() {
  const ctx = useContext(ReportFilterContext);
  if (!ctx) {
    throw new Error('useReportFilter must be used within ReportFilterProvider');
  }
  return ctx;
}