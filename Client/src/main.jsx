import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51Spt2kRF0ydwnnP0kmpdSX0YncWpSi6P1fzSSWXS6dlvwdpLoQZtyoqM0uT7CBUJhReESAkVEhkQNmRhuZiZ5zgM00pjiXapPv");

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Provider>
  </ThemeProvider>
);