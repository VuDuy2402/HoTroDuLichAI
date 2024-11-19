import { Button, Form, Modal, Row, Col, ListGroup, Image, FormSelect } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { placeService } from "../../../services/placeService";
import { toast } from "react-toastify";
import { systemAction } from "../../../redux/slices/systemSlice";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";

const AUpdatePlacePage = ({ show, onClose, placeId, onPlaceUpdated }) => {
    const [placeDetail, setPlaceDetail] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [selectedPlaceType, setSelectedPlaceType] = useState(CPlaceType.None);
    const dispatch = useDispatch();

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
                setValue("name", result.data.name);
                setValue("address", result.data.address);
                setValue("latitude", result.data.latitude);
                setValue("longitude", result.data.longtitude);
                setValue("description", result.data.description);
                setSelectedPlaceType(result.data.placeType || CPlaceType.None);
                setValue("isNew", result.data.isNew);
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
            const fileId = file.name;
            updatedImageFiles.push({ FileId: fileId, IsDefault: false });
        });
        setImageFiles(updatedImageFiles);
    };

    const handleImageDefault = (fileId) => {
        setImageFiles(prevImages =>
            prevImages.map(img =>
                img.FileId === fileId ? { ...img, IsDefault: true } : { ...img, IsDefault: false }
            )
        );
    };

    const handleImageDelete = (fileId) => {
        setImageFiles(prevImages => prevImages.filter(img => img.FileId !== fileId));
    };

    const handleSubmitUpdate = async (data) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        dispatch(systemAction.enableLoading());

        const updatedData = {
            PlaceId: placeId,
            Address: data.address,
            IsNew: data.isNew,
            Latitude: data.latitude,
            Longitude: data.longitude,
            Description: data.description,
            Name: data.name,
            PlaceType: selectedPlaceType,
            ImageFiles: imageFiles
        };

        try {
            const result = await placeService.updatePlaceAdmin(updatedData);
            if (result && result.success) {
                toast.success("Place updated successfully.");
                onPlaceUpdated();
                onClose();
            } else {
                toast.error("Failed to update place.");
            }
        } catch (error) {
            toast.error("Error updating place:", error);
        } finally {
            setIsSubmitting(false);
            dispatch(systemAction.disableLoading());
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật địa điểm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {placeDetail ? (
                    <Form onSubmit={handleSubmit(handleSubmitUpdate)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên địa điểm</Form.Label>
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
                                    <Form.Label>Địa chỉ</Form.Label>
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
                                    <Form.Label>Mô tả</Form.Label>
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
                                    <Form.Label>Loại địa điểm</Form.Label>
                                    <Form.Select
                                        value={selectedPlaceType}  // Giữ giá trị được chọn từ state
                                        onChange={(e) => setSelectedPlaceType(Number(e.target.value))} // Cập nhật state khi chọn
                                        {...register("placeType", { required: "Loại địa điểm là bắt buộc." })}
                                    >
                                        {Object.keys(CPlaceType).map(key => (
                                            <option key={key} value={CPlaceType[key]}>
                                                {PlaceTypeDescriptions[CPlaceType[key]]}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.placeType?.message}
                                    </Form.Control.Feedback>
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
                                    <Form.Label>Hình ảnh</Form.Label>
                                    <Form.Control
                                        type="file"
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="mt-3">
                            <h6>Hình ảnh</h6>
                            <ListGroup>
                                {imageFiles.map((image, idx) => (
                                    <ListGroup.Item key={idx} className="d-flex align-items-center">
                                        <div className="col-8 d-flex align-items-center">
                                            <Image
                                                src={image.url}
                                                alt={`image-${idx}`}
                                                fluid
                                                style={{ objectFit: "cover", height: "150px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                                            />
                                        </div>

                                        <div className="col-2 d-flex align-items-center">
                                            <Form.Check
                                                type="radio"
                                                name="defaultImage"
                                                checked={image.IsDefault}
                                                onChange={() => handleImageDefault(image.FileId)}
                                                aria-label="Đặt làm mặc định"
                                            />
                                            <span className="ms-2">Đặt làm mặc định</span>
                                        </div>

                                        <div className="col-2 d-flex align-items-center justify-content-center">
                                            <Button
                                                variant="link"
                                                onClick={() => handleImageDelete(image.FileId)}
                                                title="Xóa hình ảnh"
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </div>
                                    </ListGroup.Item>

                                ))}
                            </ListGroup>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                            <Button variant="secondary" onClick={onClose} className="me-2">Hủy bỏ</Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                Cập nhật địa điểm
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <div>Đang tải chi tiết địa điểm ...</div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AUpdatePlacePage;