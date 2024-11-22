import React, { useState, useRef } from "react";
import { Form, Button, Alert, Row, Col, Dropdown } from "react-bootstrap";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";

// LocationPicker Component
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

const RequestCreatePlacePage = () => {
    const [isNew, setIsNew] = useState(true);
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [placeType, setPlaceType] = useState(CPlaceType.None);
    const [fileIds, setFileIds] = useState([]);
    const [filePreview, setFilePreview] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    const [coordinates, setCoordinates] = useState({ latitude: 14.0583, longitude: 108.2772 });
    const [searchMapQuery, setSearchMapQuery] = useState("");
    const mapRef = useRef(null); // Tham chiếu đến bản đồ

    const removeFile = (fileId, index) => {
        setFileIds(fileIds.filter((id) => id !== fileId));
        setFilePreview(filePreview.filter((_, i) => i !== index));
    };

    const handleCreatePlace = () => {
        if (!name || placeType === CPlaceType.None) {
            setAlertMessage({ type: "danger", message: "Please fill out all required fields." });
            return;
        }

        const placeRequest = {
            IsNew: isNew,
            Description: description,
            Name: name,
            PlaceType: placeType,
            FileIds: fileIds,
        };

        setAlertMessage({ type: "success", message: "Place created successfully!" });
    };

    const handleImagesUploaded = (fileId) => {
        setFileIds((prevFileIds) => [...prevFileIds, fileId]);
    };

    const handleSearchOnMap = async () => {
        if (!searchMapQuery) return;

        const encodedQuery = encodeURIComponent(searchMapQuery);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data[0]) {
                const { lat, lon } = data[0];
                const newCoordinates = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
                setCoordinates(newCoordinates);

                // Di chuyển bản đồ tới vị trí mới
                if (mapRef.current) {
                    mapRef.current.flyTo([newCoordinates.latitude, newCoordinates.longitude], 12);
                }
            } else {
                setAlertMessage({ type: "danger", message: "Không tìm thấy địa điểm. Vui lòng thử lại." });
            }
        } catch (error) {
            setAlertMessage({ type: "danger", message: "Lỗi khi tìm kiếm địa điểm. Vui lòng thử lại." });
        }
    };

    return (
        <div className="container">
            <h2>Tạo địa điểm mới.</h2>
            {alertMessage && (
                <Alert variant={alertMessage.type}>{alertMessage.message}</Alert>
            )}

            <Form>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter place name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="placeType">
                    <Form.Label>Place Type</Form.Label>
                    <Dropdown onSelect={(selected) => setPlaceType(parseInt(selected))}>
                        <Dropdown.Toggle variant="success" id="dropdown-custom-components">
                            {PlaceTypeDescriptions[placeType]}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.keys(PlaceTypeDescriptions).map((key) => (
                                <Dropdown.Item key={key} eventKey={key}>
                                    {PlaceTypeDescriptions[key]}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group controlId="isNew">
                    <Form.Check
                        type="checkbox"
                        label="Is this a new place?"
                        checked={isNew}
                        onChange={(e) => setIsNew(e.target.checked)}
                    />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter place description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="files" className="mt-3">
                    <Form.Label>Tải hình ảnh lên</Form.Label>
                    <ImageUploadGallery onImagesUploaded={handleImagesUploaded} />
                </Form.Group>

                {filePreview.length > 0 && (
                    <div className="mt-3">
                        <h5>Tải hình ảnh lên</h5>
                        <div className="d-flex flex-wrap">
                            {filePreview.map((file, index) => (
                                <div key={index} className="position-relative m-2">
                                    <img src={file} alt={`Uploaded ${index}`} className="img-thumbnail" width={100} />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0"
                                        onClick={() => removeFile(fileIds[index], index)}
                                    >
                                        &times;
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Button variant="success" onClick={handleCreatePlace} className="mt-3">
                    Create Place
                </Button>
            </Form>

            <div style={{ position: "relative", height: "400px" }}>
                {/* Search Input */}
                <div style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 1000,
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Search by name or address"
                            value={searchMapQuery}
                            onChange={(e) => setSearchMapQuery(e.target.value)}
                        />
                        <Button variant="primary" onClick={handleSearchOnMap} style={{ marginTop: "5px" }}>
                            Tìm
                        </Button>
                    </Form.Group>
                </div>

                {/* Map */}
                <MapContainer
                    center={[coordinates.latitude, coordinates.longitude]}
                    zoom={8}
                    style={{ height: "100%", width: "100%" }}
                    ref={mapRef} // Tham chiếu đến bản đồ
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationPicker setCoordinates={setCoordinates} position={[coordinates.latitude, coordinates.longitude]} />
                </MapContainer>
            </div>
        </div>
    );
};

export default RequestCreatePlacePage;