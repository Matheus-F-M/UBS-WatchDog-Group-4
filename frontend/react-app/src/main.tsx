/* LEARNING NOTES FOR PAT
  - This is the first file to be executed in this React Vite application (index.html points to this file).
  - ReactDOM connects the React library to the actual DOM in the browser.
  - App/ is the top-level component pointing to App.tsx where the main application code resides.
  - StrictMode help catching bugs
  - Imports index.css for GLOBAL STYLES
  - We will RARELY TOUCH this file after set up
  */

/*
  NOTES:
    Check routes.txt
      We might not need all those routes, but I put them all there 
    for better visualization of the app structure.
*/

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.tsx";
import Login from "./pages/auth-pages/Login.tsx"; // make Login component
import Register from "./pages/auth-pages/Register.tsx"; // make Register component
import AuthLayout from "./pages/auth-pages/AuthLayout.tsx"; // Authlayout is for wrapping auth pages

import Dashboard from "./pages/dashboard-pages/Dashboard.tsx"; // Dashboard layout
import Home from "./pages/dashboard-pages/HomePage.tsx"; // Dashboard home page
import ClientPage from "./pages/dashboard-pages/ClientPage.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<Home />} />
        <Route path="clients" element={<ClientPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);