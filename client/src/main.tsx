import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { appRoutes } from "./App";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import { normalizePath } from "./lib/seo";
import "./styles.css";

const router = createBrowserRouter(appRoutes);

const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <CurrentUserProvider>
      <RouterProvider router={router} />
    </CurrentUserProvider>
  </React.StrictMode>
);

if (root.dataset.prerender === normalizePath(window.location.pathname)) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
