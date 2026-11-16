import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { appRoutes } from "./App";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import "./styles.css";

const router = createBrowserRouter(appRoutes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CurrentUserProvider>
      <RouterProvider router={router} />
    </CurrentUserProvider>
  </React.StrictMode>,
);
