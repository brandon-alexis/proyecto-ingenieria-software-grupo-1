import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "sileo";

createRoot(document.getElementById("root")!).render(
  <Toaster position="top-center">
    <App />
  </Toaster>
);
