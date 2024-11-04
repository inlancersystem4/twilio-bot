import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const RouterHandler = ({ children }) => {
  const { isLogging } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLogging) {
      if (location.pathname !== "/login") {
        navigate("/login");
      }
    } else if (location.pathname === "/login") {
      navigate("/");
    }
  }, [isLogging, location.pathname, navigate]);

  return <>{children}</>;
};

export default RouterHandler;
