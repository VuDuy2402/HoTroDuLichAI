import { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { placeService } from "../../../services/placeService";
import { toast } from "react-toastify";
import { systemAction } from "../../../redux/slices/systemSlice";
import { FaImage, FaMapMarkedAlt } from "react-icons/fa";

const AUpdatePlacePage = ({ show, onClose, placeId, onPlaceUpdated }) => {
    const [placeDetail, setPlaceDetail] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const dispatch = useDispatch();

    // Fetch place details when the modal opens
    useEffect(() => {
        if (placeId && show) {
            fetchPlaceDetail();
        }
    }, [placeId, show]);

    const fetchPlaceDetail = async () => {
        dispatch(systemAction.enableLoading());
        try {
            const result = await placeService.getPlaceById(placeId);
            if (result && result.success) {
                setPlaceDetail(result.data);
                // Set form values based on the fetched place data
                setValue("name", result.data.name);
                setValue("address", result.data.address);
                setValue("latitude", result.data.latitude);
                setValue("longitude", result.data.longtitude);
                setValue("description", result.data.description);
                setValue("placeType", result.data.placeType);
                setValue("isNew", result.data.isNew);
                // Prepare images for display
                setImageFiles(result.data.imageDetailProperties || []);
            } else {
                toast.error("Failed to load place details.");
            }
        } catch (error) {
            toast.error("Error fetching place details:", error);
        } finally {
            dispatch(systemAction.disableLoading());
        }
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const updatedImageFiles = [...imageFiles];
        files.forEach(file => {
            const fileId = file.name; // You may replace this with an actual file upload API logic
            updatedImageFiles.push({ FileId: fileId, IsDefault: false });
        });
        setImageFiles(updatedImageFiles);
    };

    const handleImageDefault = (fileId) => {
        setImageFiles(prevImages =>
            prevImages.map(img =>
                img.FileId === fileId ? { ...img, IsDefault: true } : img
            )
        );
    };

    const handleSubmitUpdate = async (data) => {
        dispatch(systemAction.enableLoading());
        const updatedData = {
            PlaceId: placeId,
            Address: data.address,
            IsNew: data.isNew,
            Latitude: data.latitude,
            Longitude: data.longitude,
            Description: data.description,
            Name: data.name,
            PlaceType: data.placeType,
            ImageFiles: imageFiles
        };
        try {
            const result = await placeService.updatePlaceAdmin(updatedData);
            if (result && result.success) {
                toast.success("Place updated successfully.");
                onPlaceUpdated(); // Refresh the places list after updating
                onClose(); // Close the modal
            } else {
                toast.error("Failed to update place.");
            }
        } catch (error) {
            toast.error("Error updating place:", error);
        } finally {
            dispatch(systemAction.disableLoading());
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Place</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {placeDetail ? (
                    <Form onSubmit={handleSubmit(handleSubmitUpdate)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register("name", { required: "Name is required" })}
                                        defaultValue={placeDetail.name}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register("address", { required: "Address is required" })}
                                        defaultValue={placeDetail.address}
                                        isInvalid={!!errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Latitude</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.0001"
                                        {...register("latitude", { required: "Latitude is required" })}
                                        defaultValue={placeDetail.latitude}
                                        isInvalid={!!errors.latitude}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.latitude?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.0001"
                                        {...register("longitude", { required: "Longitude is required" })}
                                        defaultValue={placeDetail.longtitude}
                                        isInvalid={!!errors.longitude}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.longitude?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        {...register("description")}
                                        defaultValue={placeDetail.description}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Place Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        {...register("placeType", { required: "Place Type is required" })}
                                        defaultValue={placeDetail.placeType}
                                    >
                                        <option value="1">Type 1</option>
                                        <option value="2">Type 2</option>
                                        <option value="3">Type 3</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Is New</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        {...register("isNew")}
                                        defaultChecked={placeDetail.isNew}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Images</Form.Label>
                                    <Form.Control
                                        type="file"
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="mt-3">
                            <h6>Current Images</h6>
                            <div className="d-flex flex-wrap">
                                {imageFiles.map((image, idx) => (
                                    <div key={idx} className="position-relative me-3 mb-3">
                                        <img
                                            src={image.Url}
                                            alt={`image-${idx}`}
                                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                        />
                                        <div className="position-absolute top-0 end-0">
                                            <Button
                                                variant="link"
                                                onClick={() => handleImageDefault(image.FileId)}
                                                title="Set as default"
                                            >
                                                {image.IsDefault ? "✔" : "Set Default"}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={onClose} className="me-2">Cancel</Button>
                            <Button type="submit" variant="primary">Update Place</Button>
                        </div>
                    </Form>
                ) : (
                    <div>Loading place details...</div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AUpdatePlacePage;