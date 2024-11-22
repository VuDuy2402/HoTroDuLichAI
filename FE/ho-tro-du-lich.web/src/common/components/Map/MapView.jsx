import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Button, Form } from "react-bootstrap";
import axios from "axios"; // Dùng axios để gọi API geocoding

// LocationPicker component to update coordinates on map click
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

const MapView = ({ onCoordinatesChange }) => {
    const [coordinates, setCoordinates] = useState({ latitude: 14.0583, longitude: 108.2772 });
    const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu từ API
    const mapRef = useRef(null);

    // Handle changes when latitude or longitude is manually updated
    const handleLatitudeChange = (e) => {
        const newLatitude = parseFloat(e.target.value);
        setCoordinates((prevCoordinates) => {
            const updatedCoordinates = { ...prevCoordinates, latitude: newLatitude };
            onCoordinatesChange(updatedCoordinates); // Pass new coordinates to parent
            return updatedCoordinates;
        });
    };

    const handleLongitudeChange = (e) => {
        const newLongitude = parseFloat(e.target.value);
        setCoordinates((prevCoordinates) => {
            const updatedCoordinates = { ...prevCoordinates, longitude: newLongitude };
            onCoordinatesChange(updatedCoordinates); // Pass new coordinates to parent
            return updatedCoordinates;
        });
    };

    // Xử lý tìm kiếm địa chỉ và cập nhật bản đồ
    const handleSearch = async () => {
        if (searchQuery.trim() === "") return;

        setLoading(true);
        try {
            // Gọi API Geocoding, ví dụ sử dụng Nominatim (OpenStreetMap)
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: searchQuery,
                    format: "json",
                    limit: 1,
                },
            });

            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
                onCoordinatesChange({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
            } else {
                alert("Không tìm thấy địa chỉ!");
            }
        } catch (error) {
            console.error("Lỗi tìm kiếm địa chỉ:", error);
            alert("Đã xảy ra lỗi khi tìm kiếm địa chỉ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "relative", height: "400px" }}>
            {/* Tìm kiếm */}
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
                    width: "300px",
                }}
            >
                <Form.Group>
                    <Form.Label>Tìm kiếm địa điểm</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên địa điểm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={handleSearch}
                    disabled={loading}
                    style={{ width: "100%", marginTop: "10px" }}
                >
                    {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
                </Button>
            </div>

            {/* Latitude and Longitude Inputs */}
            <div
                style={{
                    position: "absolute",
                    top: 100,
                    left: 10,
                    zIndex: 1000,
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Form.Group>
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.0001"
                        value={coordinates.latitude || ""}
                        onChange={handleLatitudeChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.0001"
                        value={coordinates.longitude || ""}
                        onChange={handleLongitudeChange}
                    />
                </Form.Group>
            </div>

            {/* Map */}
            <MapContainer
                center={[coordinates.latitude, coordinates.longitude]}
                zoom={8}
                style={{ height: "100%", width: "100%" }}
                whenCreated={(map) => {
                    mapRef.current = map;
                }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker
                    setCoordinates={setCoordinates}
                    position={[coordinates.latitude, coordinates.longitude]}
                />
            </MapContainer>
        </div>
    );
};

export default MapView;
