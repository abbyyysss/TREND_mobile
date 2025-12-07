import { createContext, useContext } from 'react';

const ProfileRouteContext = createContext({ viewed: null, isMine: false, loading: true });
export const useProfileRoute = () => useContext(ProfileRouteContext);
export const ProfileRouteProvider = ({ value, children }) => (
  <ProfileRouteContext.Provider value={value}>{children}</ProfileRouteContext.Provider>
);
