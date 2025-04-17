// UserContext.js
import React, { createContext, useState, useMemo } from "react";

// This context holds user state and a setter function
export const UserContext = createContext(null);

// The provider wraps the entire app
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Memoize the context value (optional optimization)
  const value = useMemo(
    () => ({ currentUser, setCurrentUser }),
    [currentUser]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
