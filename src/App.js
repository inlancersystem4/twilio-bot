import React from "react";
import { Routes, Route } from "react-router-dom";
import RouterHandler from "./utils/RouterHandler";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import Login from "./pages/Login";

const App = () => {
  return (
    <RouterHandler>
      <Toaster />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouterHandler>
  );
};

export default App;
