import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import MapView from "../../../common/components/Map/MapView";

const RequestCreatePlacePage = () => {
    const [isNew, setIsNew] = useState(true);
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [placeType, setPlaceType] = useState(CPlaceType.None);
    const [fileIds, setFileIds] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    const [coordinates, setCoordinates] = useState({ latitude: 14.0583, longitude: 108.2772 });

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
            Coordinates: coordinates,
        };

        console.log(placeRequest);
        setAlertMessage({ type: "success", message: "Place created successfully!" });
    };

    const handleImagesUploaded = (fileId) => {
        setFileIds((prevFileIds) => [...prevFileIds, fileId]);
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
                    <Form.Control as="select" value={placeType} onChange={(e) => setPlaceType(parseInt(e.target.value))}>
                        {Object.keys(PlaceTypeDescriptions).map((key) => (
                            <option key={key} value={key}>
                                {PlaceTypeDescriptions[key]}
                            </option>
                        ))}
                    </Form.Control>
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

                <MapView
                    initialCoordinates={coordinates}
                    onCoordinatesChange={setCoordinates}
                />

                <Button variant="success" onClick={handleCreatePlace} className="mt-3">
                    Create Place
                </Button>
            </Form>
        </div>
    );
};

export default RequestCreatePlacePage;