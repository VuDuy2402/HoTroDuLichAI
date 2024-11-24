/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useRef, useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "./MapCustom.scss";
const MapCustom = ({
  latitude = 16.047079,
  longtitude = 108.20623,
  name,
  styleMap,
  zoom = 13,
  pin = true,
  onChangePosition,
}) => {
  const [positionState, setPositionState] = useState([latitude, longtitude]);
  const handleChangePosition = (position) => {
    if (pin) {
      return;
    }
    setPositionState([position.latitude, position.longtitude]);
    onChangePosition &&
      onChangePosition([position.latitude, position.longtitude]);
  };

  return (
    <div
      style={styleMap ? styleMap : { height: "400px", marginBottom: "20px" }}
    >
      <MapContainer
        center={[latitude, longtitude]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={positionState}>
          <Popup>{name}</Popup>
        </Marker>
        <MapClickHandler onChangePosition={handleChangePosition} />
        <GeoCoder position={"topright"} />
      </MapContainer>
    </div>
  );
};

const GeoCoder = ({ position = "topright" }) => {
  const map = useMap();
  const geocoderRef = useRef(null);
  const handleClickTest = () => {
    console.log(geocoderRef.current);
    const GeoContainer = geocoderRef.current.getContainer();
    const listItem = GeoContainer.querySelector(
      ".leaflet-control-geocoder-alternatives"
    );
    listItem.innerHTML = "";
    const inputSearch = GeoContainer.querySelector(
      ".leaflet-control-geocoder-form"
    ).querySelector("input");
    inputSearch.value = "";
  };
  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true, // Tự động đánh dấu vị trí sau khi tìm
      position: position,
    })
      .on("markgeocode", function (e) {
        const { center } = e.geocode;
        map.setView(center, 13); // Di chuyển bản đồ đến vị trí tìm thấy
        L.marker(center).addTo(map); // Thêm marker vào vị trí
      })
      .addTo(map);
    geocoderRef.current = geocoder;
    const geocoderContainer = geocoder
      .getContainer()
      .querySelector(".leaflet-control-geocoder-form");
    const customButton = document.createElement("button");
    customButton.type = "button";
    customButton.className = "btn btn-light";
    customButton.innerHTML = resetSVG;
    customButton.addEventListener("click", () => {
      handleClickTest();
    });
    geocoderContainer.appendChild(customButton);
    return () => map.removeControl(geocoder); // Cleanup khi component unmount
  }, [map]);

  return null;
};

const MapClickHandler = ({ onChangePosition }) => {
  useMapEvents({
    click(e) {
      onChangePosition &&
        onChangePosition({
          latitude: e.latlng.lat,
          longtitude: e.latlng.lng,
        });
    },
  });
  return null;
};

export default MapCustom;

const resetSVG = `<svg
    stroke="currentColor"
    fill="currentColor"
    stroke-width="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="none"
      stroke-width="2"
      d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9"
    ></path>
  </svg>`;
