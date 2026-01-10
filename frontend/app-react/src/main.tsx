import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login";
import { BrowserRouter } from "react-router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Login/>
  </BrowserRouter>
)