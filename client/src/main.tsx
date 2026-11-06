import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { CartProvider } from "./context/CartContext";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CurrentUserProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CurrentUserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
