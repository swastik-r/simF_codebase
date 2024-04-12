// this context manages the visibility og overlays, bottom sheets and other comps in the app

import React, { createContext, useContext, useState } from "react";

const VisibilityContext = createContext();

export const useVisibilityContext = () => {
   const context = useContext(VisibilityContext);
   if (!context) {
      throw new Error("useVisibility must be used within a VisibilityProvider");
   }
   return context;
};

export const VisibilityProvider = ({ children }) => {
   const [searchVisible, setSearchVisible] = useState(false);

   return (
      <VisibilityContext.Provider
         value={{
            searchVisible,
            setSearchVisible,
         }}
      >
         {children}
      </VisibilityContext.Provider>
   );
};
