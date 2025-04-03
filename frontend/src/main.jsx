import React, {StrictMode} from "react";
import ReactDOM, {createRoot} from "react-dom/client";
import { Provider } from "./components/ui/provider";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
    <App />
  </Provider>
  </StrictMode>
);
