import React from "react";
import { Routes, Route } from "react-router-dom";
import RouterHandler from "./utils/RouterHandler";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import User from "./pages/User";
import Contact from "./pages/Contact";
import UserAddEdit from "./pages/UserAddEdit";

const App = () => {
  return (
    <RouterHandler>
      <Toaster />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<User />} />
        <Route path="/user-add-edit/:id?" element={<UserAddEdit />} />
        <Route path="/contacts/:id?" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouterHandler>
  );
};

export default App;
