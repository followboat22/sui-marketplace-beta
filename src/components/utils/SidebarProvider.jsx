import React, { useContext, useState } from "react";

const SidebarContext = React.createContext();

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }) {
  const [sidebarData, setSidebarData] = useState([]);

  return (
    <SidebarContext.Provider value={{ sidebarData, setSidebarData }}>
      {children}
    </SidebarContext.Provider>
  );
}
