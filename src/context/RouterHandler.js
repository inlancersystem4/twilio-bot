import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/ui/layout/LayoutWrapper";

const RouterHandler = ({ children }) => {
  const { isLogging } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLogging && location.pathname !== "/login") {
      navigate("/login");
    } else if (isLogging && location.pathname === "/login") {
      navigate("/");
    }
  }, [isLogging, location.pathname, navigate]);

  if (!isLogging) {
    return <>{children}</>;
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
};

export default RouterHandler;
