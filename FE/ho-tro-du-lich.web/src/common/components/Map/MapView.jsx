// import React, { useRef, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
// import { Form, InputGroup, Button } from "react-bootstrap";
// import { FaSearch } from "react-icons/fa";
// import { toast } from "react-toastify";

// const LocationPicker = ({ setCoordinates, position }) => {
//     useMapEvents({
//         click({ latlng: { lat, lng } }) {
//             setCoordinates({ latitude: lat, longitude: lng });
//         },
//     });

//     return position ? (
//         <Marker position={position}>
//             <Popup>Nhấn chuột vào map để chọn địa điểm</Popup>
//         </Marker>
//     ) : null;
// };

// const MapView = ({ initialCoordinates, onCoordinatesChange }) => {
//     const [coordinates, setCoordinates] = useState(initialCoordinates || { latitude: 14.0583, longitude: 108.2772 });
//     const [searchQuery, setSearchQuery] = useState("");
//     const mapRef = useRef(null);

//     const handleLatLngChange = (e, type) => {
//         const value = parseFloat(e.target.value);
//         if (!isNaN(value)) {
//             const newCoordinates = { ...coordinates, [type]: value };
//             setCoordinates(newCoordinates);
//             onCoordinatesChange(newCoordinates);
//         }
//     };

//     const handleSearchOnMap = async () => {
//         if (!searchQuery) return;

//         const encodedQuery = encodeURIComponent(searchQuery);
//         const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`;

//         try {
//             const response = await fetch(url);
//             const data = await response.json();

//             if (data && data[0]) {
//                 const { lat, lon } = data[0];
//                 const newCoordinates = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
//                 setCoordinates(newCoordinates);
//                 onCoordinatesChange(newCoordinates);

//                 if (mapRef.current) {
//                     mapRef.current.flyTo([newCoordinates.latitude, newCoordinates.longitude], 12);
//                 }
//             } else {
//                 toast.error("Không tìm thấy địa điểm. Vui lòng thử lại.");
//             }
//         } catch (error) {
//             toast.error("Đã xảy ra lỗi." + error);
//         }
//     };

//     return (
//         <div style={{ position: "relative", height: "400px" }}>
//             <div
//                 style={{
//                     position: "absolute",
//                     top: 10,
//                     left: 10,
//                     zIndex: 1000,
//                     backgroundColor: "white",
//                     padding: "10px",
//                     borderRadius: "5px",
//                     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                 }}
//             >
//                 <InputGroup>
//                     <Form.Control
//                         type="text"
//                         placeholder="Search by name or address"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && handleSearchOnMap()}
//                     />
//                     <Button onClick={handleSearchOnMap}>
//                         <FaSearch />
//                     </Button>
//                 </InputGroup>
//             </div>

//             <MapContainer
//                 center={[coordinates.latitude, coordinates.longitude]}
//                 zoom={8}
//                 style={{ height: "100%", width: "100%" }}
//                 ref={mapRef}
//             >
//                 <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 <LocationPicker
//                     setCoordinates={(newCoordinates) => {
//                         setCoordinates(newCoordinates);
//                         onCoordinatesChange(newCoordinates);
//                     }}
//                     position={[coordinates.latitude, coordinates.longitude]}
//                 />
//             </MapContainer>

//             <div
//                 style={{
//                     position: "absolute",
//                     bottom: "10px",
//                     right: "10px",
//                     zIndex: 1000,
//                     backgroundColor: "white",
//                     padding: "5px",
//                     borderRadius: "5px",
//                     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                 }}
//             >
//                 <Form.Group className="d-flex">
//                     <Form.Label>Vĩ độ</Form.Label>
//                     <Form.Control
//                         type="number"
//                         placeholder="Latitude"
//                         value={coordinates.latitude || ""}
//                         onChange={(e) => handleLatLngChange(e, "latitude")}
//                     />
//                     <Form.Label>Kinh độ</Form.Label>
//                     <Form.Control
//                         type="number"
//                         placeholder="Longitude"
//                         value={coordinates.longitude || ""}
//                         onChange={(e) => handleLatLngChange(e, "longitude")}
//                     />
//                 </Form.Group>
//             </div>
//         </div>
//     );
// };

// export default MapView;




import { useRef, useState } from "react";
import { MapContainer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Form, InputGroup, Button, Card, Container } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

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
                toast.error("Không tìm thấy địa điểm. Vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi." + error);
        }
    };

    return (
        <Container fluid className="position-relative shadow rounded py-2" style={{ height: "400px" }}>
            <Card
                className="position-absolute"
                style={{
                    top: 10,
                    left: 60,
                    zIndex: 1000,
                    padding: "5px",
                    width: "auto",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                }}
            >
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm địa điểm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearchOnMap()}
                        style={{ fontSize: "0.75rem", padding: "5px", width: "150px" }}
                    />
                    <Button onClick={handleSearchOnMap} style={{ fontSize: "0.75rem", padding: "5px" }}>
                        <FaSearch />
                    </Button>
                </InputGroup>
            </Card>

            <MapContainer
                center={[coordinates.latitude, coordinates.longitude]}
                zoom={8}
                style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
                ref={mapRef}
            >
                <LocationPicker
                    setCoordinates={(newCoordinates) => {
                        setCoordinates(newCoordinates);
                        onCoordinatesChange(newCoordinates);
                    }}
                    position={[coordinates.latitude, coordinates.longitude]}
                />
            </MapContainer>

            <Card
                className="position-absolute p-2 d-flex"
                style={{
                    bottom: 15,
                    right: 15,
                    zIndex: 1000,
                    width: "fit-content",
                    minWidth: "auto",
                    maxWidth: "100px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
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
        </Container>
    );
};

export default MapView;