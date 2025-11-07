import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import "@fontsource-variable/montserrat";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/citizendatadashboard/">
    <App />
  </BrowserRouter>
);
