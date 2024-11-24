import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "leaflet/dist/leaflet.css";
import "react-toastify/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import App from "./App";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
