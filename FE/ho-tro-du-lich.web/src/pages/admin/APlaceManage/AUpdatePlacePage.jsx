import { Button, Form, Modal, Row, Col, Table } from "react-bootstrap";
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
    const { handleSubmit, setValue, formState: { errors } } = useForm();
    const [selectedPlaceType, setSelectedPlaceType] = useState(CPlaceType.None);
    const [errorMessages, setErrorMessages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
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
                setValue("longitude", result.data.longitude);
                setValue("description", result.data.description);
                setSelectedPlaceType(result.data.placeType || CPlaceType.None);
                setValue("isNew", result.data.isNew);
                setImageFiles(result.data.imageDetailProperties || []);
            } else if (result && result.errors) {
                setErrorMessages(result.errors);
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

    useEffect(() => {
        if (selectedFiles.length === imageFiles.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedFiles, imageFiles.length]);

    const handleImageDelete = async (fileId, placeId) => {
        dispatch(systemAction.enableLoading());
        try {
            const requestData = {
                placeId: placeId,
                fileIds: [fileId]
            }
            const response = await placeService.deletePlaceImagesAdmin(requestData);
            if (response && response.success) {
                toast.success(response.data.message);
                setImageFiles(prevImages => prevImages.filter(img => img.FileId !== fileId));
            }
            else if (response && response.errors) {
                setErrorMessages(response.errors);
            }
        }
        catch {
            toast.error("Đã có lỗi xảy ra khi thực hiện việc xóa hình ảnh của địa điểm.");
        }
        finally {
            dispatch(systemAction.disableLoading());
        }
    };

    const handleSelectFile = (fileId) => {
        setSelectedFiles((prevSelected) => {
            if (prevSelected.includes(fileId)) {
                return prevSelected.filter(id => id !== fileId);
            } else {
                return [...prevSelected, fileId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(imageFiles.map(img => img.FileId));
        }
        setSelectAll(!selectAll);
    };

    const handleDeleteSelected = async () => {
        if (selectedFiles.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một hình ảnh để xóa.");
            return;
        }

        try {
            const response = await placeService.deletePlaceImagesAdmin({
                placeId,
                fileIds: selectedFiles
            });

            if (response && response.success) {
                toast.success(response.data.message);
                setSelectedFiles([]);
            } else {
                toast.error(response.errors || "Lỗi khi xóa hình ảnh.");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra khi xóa hình ảnh.");
        }
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
                                        defaultValue={placeDetail.name}
                                        isInvalid={!!errors.name}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        defaultValue={placeDetail.address}
                                        isInvalid={!!errors.address}
                                    />
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
                                        defaultValue={placeDetail.latitude}
                                        isInvalid={!!errors.latitude}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Longitude</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.0001"
                                        defaultValue={placeDetail.longitude}
                                        isInvalid={!!errors.longitude}
                                    />
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
                                        defaultValue={placeDetail.description}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại địa điểm</Form.Label>
                                    <Form.Select
                                        value={selectedPlaceType}
                                        onChange={(e) => {
                                            const newValue = Number(e.target.value);
                                            setSelectedPlaceType(newValue);
                                            setValue("placeType", newValue);
                                        }}
                                    >
                                        {Object.keys(CPlaceType).map(key => (
                                            <option key={key} value={CPlaceType[key]}>
                                                {PlaceTypeDescriptions[CPlaceType[key]]}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Là địa điểm mới</Form.Label>
                                    <Form.Check
                                        type="checkbox"
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
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>
                                            <Form.Check
                                                type="checkbox"
                                                label="Chọn tất cả"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>Hình ảnh</th>
                                        <th>Đặt làm mặc định</th>
                                        <th>
                                            <Button variant="link" onClick={handleDeleteSelected} disabled={selectedFiles.length === 0}>
                                                Xóa tất cả
                                            </Button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {imageFiles.map((image, idx) => (
                                        <tr key={image.FileId}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedFiles.includes(image.FileId)}
                                                    onChange={() => handleSelectFile(image.FileId)}
                                                />
                                            </td>
                                            <td>
                                                <img
                                                    src={image.url}
                                                    alt={`image-${idx}`}
                                                    style={{
                                                        objectFit: "cover",
                                                        height: "100px",
                                                        width: "100px",
                                                        borderRadius: "8px",
                                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <Form.Check
                                                    type="radio"
                                                    name="defaultImage"
                                                    checked={image.IsDefault}
                                                    onChange={() => handleImageDefault(image.FileId)}
                                                    aria-label="Đặt làm mặc định"
                                                />
                                            </td>
                                            <td>
                                                <Button
                                                    variant="link"
                                                    onClick={() => {
                                                        handleImageDelete(image.fileId, placeDetail.placeId);
                                                    }}
                                                    title="Xóa hình ảnh"
                                                >
                                                    <FaTrashAlt />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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