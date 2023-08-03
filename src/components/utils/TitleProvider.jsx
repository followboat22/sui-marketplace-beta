import React, { useContext, useState } from "react";

const TitleContext = React.createContext();

export function useTitle() {
  return useContext(TitleContext);
}

export function TitleProvider({ children }) {
  const [title, setTitle] = useState("Onyx");
  document.title = title ? title + " | Onyx" : "Onyx";

  return (
    <TitleContext.Provider value={{ title, setTitle }}>{children}</TitleContext.Provider>
  );
}
