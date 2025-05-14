
import React from "react";
import ReactDOM from "react-dom/client";
import AppWithAuth from "./AppWithAuth";
import "./index.css";

// Make sure to mount to an existing DOM element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>,
);
