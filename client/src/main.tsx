import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { appRoutes } from "./App";
import { CartProvider } from "./context/CartContext";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import "./styles.css";

const router = createBrowserRouter(appRoutes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CurrentUserProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </CurrentUserProvider>
  </React.StrictMode>,
);
