/* LEARNING NOTES FOR PAT
  - This is the first file to be executed in this React Vite application (index.html points to this file).
  - ReactDOM connects the React library to the actual DOM in the browser.
  - App/ is the top-level component pointing to App.tsx where the main application code resides.
  - StrictMode help catching bugs
  - Imports index.css for GLOBAL STYLES
  - We will RARELY TOUCH this file after set up
  */

import ReactDOM from "react-dom/client";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Login from "./pages/auth-pages/Login.tsx"; // make Login component
import Register from "./pages/auth-pages/Register.tsx"; // make Register component
import AuthLayout from "./pages/auth-pages/AuthLayout.tsx"; // Authlayout is for wrapping auth pages

import Dashboard from "./pages/dashboard-pages/Dashboard.tsx"; // Dashboard layout
import Home from "./pages/dashboard-pages/HomePage.tsx"; // Dashboard home page
import ClientPage from "./pages/dashboard-pages/ClientPage.tsx"; // Client page
import TransactionPage from "./pages/dashboard-pages/TransactionPage.tsx"; // Transaction page
import AlertPage from "./pages/dashboard-pages/AlertPage.tsx";
import ClientReport from "./pages/reports/ClientReport.tsx";
import NotFoundPage from "./pages/notFoundPage.tsx";

const BRAN_router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "clients",
        element: <ClientPage />,
      },
      {
        path: "clients/:clientId",
        element: <ClientReport />,
      },
      {
        path: "transactions",
        element: <TransactionPage />,
      },
      {
        path: "alerts",
        element: <AlertPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={BRAN_router} />
  </React.StrictMode>
);