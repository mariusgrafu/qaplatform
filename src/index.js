import React from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "./contexts/AuthContext";
import App from "./components/App";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
