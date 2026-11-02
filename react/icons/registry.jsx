import React, { createContext, useContext, useMemo } from "react";
const IconContext = createContext({});
export function IconProvider({ icons, children }) {
  const parent = useContext(IconContext);
  const value = useMemo(() => ({ ...parent, ...icons }), [parent, icons]);
  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}
export const useCustomIcons = () => useContext(IconContext);
