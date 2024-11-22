import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const LocationPicker = ({ setCoordinates, position }) => {
    useMapEvents({
        click({ latlng: { lat, lng } }) {
            setCoordinates({ latitude: lat, longitude: lng });
        },
    });

    return position ? (
        <Marker position={position}>
            <Popup>Nhấn chuột vào map để chọn địa điểm</Popup>
        </Marker>
    ) : null;
};

const MapView = ({ initialCoordinates, onCoordinatesChange }) => {
    const [coordinates, setCoordinates] = useState(initialCoordinates || { latitude: 14.0583, longitude: 108.2772 });
    const [searchQuery, setSearchQuery] = useState("");
    const mapRef = useRef(null);

    const handleLatLngChange = (e, type) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            const newCoordinates = { ...coordinates, [type]: value };
            setCoordinates(newCoordinates);
            onCoordinatesChange(newCoordinates);
        }
    };

    const handleSearchOnMap = async () => {
        if (!searchQuery) return;

        const encodedQuery = encodeURIComponent(searchQuery);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data[0]) {
                const { lat, lon } = data[0];
                const newCoordinates = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
                setCoordinates(newCoordinates);
                onCoordinatesChange(newCoordinates);

                if (mapRef.current) {
                    mapRef.current.flyTo([newCoordinates.latitude, newCoordinates.longitude], 12);
                }
            } else {
                alert("Không tìm thấy địa điểm. Vui lòng thử lại.");
            }
        } catch (error) {
            alert("Lỗi khi tìm kiếm địa điểm. Vui lòng thử lại.");
        }
    };

    return (
        <div style={{ position: "relative", height: "400px" }}>
            {/* Search Box */}
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 1000,
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Search by name or address"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearchOnMap()}
                    />
                    <Button onClick={handleSearchOnMap}>
                        <FaSearch />
                    </Button>
                </InputGroup>
            </div>

            {/* Map */}
            <MapContainer
                center={[coordinates.latitude, coordinates.longitude]}
                zoom={8}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationPicker
                    setCoordinates={(newCoordinates) => {
                        setCoordinates(newCoordinates);
                        onCoordinatesChange(newCoordinates);
                    }}
                    position={[coordinates.latitude, coordinates.longitude]}
                />
            </MapContainer>

            {/* Latitude/Longitude Inputs */}
            <div
                style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    zIndex: 1000,
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Form.Group className="d-flex">
                    <Form.Label>Vĩ độ</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Latitude"
                        value={coordinates.latitude || ""}
                        onChange={(e) => handleLatLngChange(e, "latitude")}
                    />
                    <Form.Label>Kinh độ</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Longitude"
                        value={coordinates.longitude || ""}
                        onChange={(e) => handleLatLngChange(e, "longitude")}
                    />
                </Form.Group>
            </div>
        </div>
    );
};

export default MapView;