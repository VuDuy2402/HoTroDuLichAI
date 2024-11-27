import { forwardRef, useEffect, useRef, useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import { Card, Form } from "react-bootstrap";
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
  label,
}) => {
  const [positionState, setPositionState] = useState([latitude, longtitude]);
  const [coordinates, setCoordinates] = useState({
    latitude,
    longitude: longtitude,
  });

  const handleChangePosition = (position) => {
    if (pin) return;

    setPositionState([position.latitude, position.longitude]);
    setCoordinates({ latitude: position.latitude, longitude: position.longitude });

    if (onChangePosition) {
      onChangePosition([position.latitude, position.longitude]);
    }
  };

  const handleLatLngChange = (e, type) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) return;

    const updatedCoordinates = { ...coordinates, [type]: value };
    setCoordinates(updatedCoordinates);
    setPositionState([updatedCoordinates.latitude, updatedCoordinates.longitude]);
    if (onChangePosition) {
      onChangePosition([updatedCoordinates.latitude, updatedCoordinates.longitude]);
    }
  };

  return (
    <div
      style={styleMap ? styleMap : { height: "400px", marginBottom: "20px" }}
    >
      {label && <label className="fw-bold">{label}</label>}
      <MapContainer
        center={[latitude, longtitude]}
        zoom={zoom}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {positionState && (
          <Marker position={positionState}>
            <Popup>{name}</Popup>
          </Marker>
        )}
        {!positionState && pin && (
          <Marker position={[latitude, longtitude]}>
            <Popup>{name}</Popup>
          </Marker>
        )}
        <MapClickHandler onChangePosition={handleChangePosition} />
        <GeoCoder
          position={"topright"}
          onReset={() => setPositionState(null)}
          onChangePosition={handleChangePosition}
        />

        <Card
          className="position-absolute p-2 d-flex"
          style={{
            bottom: 0,
            right: 0,
            zIndex: 1000,
            width: "fit-content",
            minWidth: "auto",
            maxWidth: "100px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Form.Group>
            <Form.Label style={{ fontSize: "0.7rem" }}>Kinh độ</Form.Label>
            <Form.Control
              type="number"
              placeholder="Longitude"
              value={coordinates.longitude || ""}
              onChange={(e) => handleLatLngChange(e, "longitude")}
              style={{ fontSize: "0.7rem", padding: "3px", width: "100%" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={{ fontSize: "0.7rem" }}>Vĩ độ</Form.Label>
            <Form.Control
              type="number"
              placeholder="Latitude"
              value={coordinates.latitude || ""}
              onChange={(e) => handleLatLngChange(e, "latitude")}
              style={{ fontSize: "0.7rem", padding: "3px", width: "100%" }}
            />
          </Form.Group>
        </Card>
      </MapContainer>
    </div>
  );
};

const GeoCoder = ({ position = "topright", onReset, onChangePosition }) => {
  const map = useMap();
  const geocoderRef = useRef(null);
  const handleClickReset = () => {
    const GeoContainer = geocoderRef.current.getContainer();
    const listItem = GeoContainer.querySelector(
      ".leaflet-control-geocoder-alternatives"
    );
    listItem.innerHTML = "";
    const inputSearch = GeoContainer.querySelector(
      ".leaflet-control-geocoder-form"
    ).querySelector("input");
    inputSearch.value = "";
    onReset();
  };

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false, // Tự động đánh dấu vị trí sau khi tìm
      position: position,
    })
      .on("markgeocode", function (e) {
        const { center } = e.geocode;
        onChangePosition({ latitude: center.lat, longitude: center.lng });
        map.setView(center, 13); // Di chuyển bản đồ đến vị trí tìm thấy
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
      handleClickReset();
    });
    geocoderContainer.appendChild(customButton);
    return () => map.removeControl(geocoder);
  }, [map]);

  return null;
};

const MapClickHandler = ({ onChangePosition }) => {
  useMapEvents({
    click(e) {
      onChangePosition &&
        onChangePosition({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
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
