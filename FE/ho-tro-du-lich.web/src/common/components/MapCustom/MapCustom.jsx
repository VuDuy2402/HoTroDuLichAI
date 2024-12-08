import { useEffect, useRef, useState } from "react";
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
  latitude,
  longitude,
  name,
  styleMap,
  zoom = 13,
  pin = true,
  onChangePosition,
  label,
}) => {
  const [positionState, setPositionState] = useState([latitude, longitude]);

  const handleChangePosition = (position) => {
    if (pin) {
      return;
    };
    setPositionState([position.latitude, position.longitude]);
    if (onChangePosition) {
      onChangePosition([position.latitude, position.longitude]);
    }
  };

  useEffect(() => {   
    if (latitude && longitude) {
      setPositionState([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div
      style={styleMap ? styleMap : { height: "400px", marginBottom: "20px" }}
    >
      {label && <label className="fw-bold">{label}</label>}
      <MapContainer
        center={
          latitude && longitude
            ? [latitude, longitude]
            : [16.047079, 108.20623]
        }
        zoom={zoom}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {positionState && positionState[0] && positionState[1] && (
          <Marker position={positionState}>
            <Popup>{name}</Popup>
          </Marker>
        )}
        {!positionState && pin && latitude && longitude && (
          <Marker position={[latitude, longitude]}>
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
              value={positionState[1] || ""}
              onChange={(e) =>
                handleChangePosition({
                  longitude: Number(e.target.value),
                  latitude: positionState[0],
                })
              }
              style={{ fontSize: "0.7rem", padding: "3px", width: "100%" }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label style={{ fontSize: "0.7rem" }}>Vĩ độ</Form.Label>
            <Form.Control
              type="number"
              placeholder="Latitude"
              value={positionState[0] || ""}
              onChange={(e) =>
                handleChangePosition({
                  latitude: e.target.value,
                  longitude: positionState[1],
                })
              }
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
      defaultMarkGeocode: false,
      position: position,
    })
      .on("markgeocode", function (e) {
        const { center } = e.geocode;
        onChangePosition({ latitude: center.lat, longitude: center.lng });
        map.setView(center, 13);
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
