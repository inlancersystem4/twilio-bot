import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RouterHandler = ({ children }) => {
  const { isLogging } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isLogging) {
    return location.pathname === "/login" ? (
      <div>{children}</div>
    ) : (
      <Navigate to="/login" />
    );
  }

  return location.pathname === "/login" ? <Navigate to="/" /> : <>{children}</>;
};

export default RouterHandler;
