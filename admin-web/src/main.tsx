import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store.ts";
import { Provider } from "react-redux";

declare global {
  interface Window {
    store: typeof store;
  }
}

window.store = store;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
