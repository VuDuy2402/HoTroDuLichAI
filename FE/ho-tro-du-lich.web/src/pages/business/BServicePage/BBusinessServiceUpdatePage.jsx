import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";
import { CBusinessServiceStatus, CBusinessServiceStatusDescription, CBusinessServiceType, CBusinessServiceTypeDescriptions } from "../../../enum/businessTypeEnum";
import { businessService } from "../../../services/businessService";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import { FaTimes } from "react-icons/fa";
import useDocumentTitle from "../../../common/js/useDocumentTitle";

const BBusinessServiceUpdatePage = ({ show, onHide, service, onUpdateSuccess, businessId }) => {
    const [updatedData, setUpdatedData] = useState(service);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    useDocumentTitle('Cập nhật dịch vụ doanh nghiệp');

    useEffect(() => {
        setUpdatedData(service);
    }, [service]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);

        const updatedService = {
            ...updatedData,
            status: Number(updatedData.status),
            type: Number(updatedData.type),
            quantity: Number(updatedData.quantity),
            amount: Number(updatedData.amount)
        };

        try {
            const response = await businessService.updateBusinessServiceById({
                businessId: businessId,
                serviceProperty: updatedService
            });
            if (response && response.success) {
                toast.success("Dịch vụ đã được cập nhật");
                onUpdateSuccess();
                onHide();
            } else {
                setErrors(response.errors || []);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleImagesUploaded = (newImage) => {
        const updatedThumbnail = newImage.url;
        setUpdatedData((prevData) => ({
            ...prevData,
            thumbnail: updatedThumbnail
        }));
    };

    const handleRemoveImage = () => {
        setUpdatedData((prevData) => ({
            ...prevData,
            thumbnail: ""
        }));
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật dịch vụ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                {!loading && updatedData && (
                    <Form>
                        <Form.Group className="mb-3" controlId="formServiceName">
                            <Form.Label>Tên dịch vụ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên dịch vụ"
                                name="name"
                                value={updatedData.name || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formServiceAmount">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập giá dịch vụ"
                                name="amount"
                                value={updatedData.amount || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formServiceQuantity">
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Nhập số lượng"
                                name="quantity"
                                value={updatedData.quantity || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formServiceType">
                            <Form.Label>Loại dịch vụ</Form.Label>
                            <Form.Control
                                as="select"
                                name="type"
                                value={updatedData.type || CBusinessServiceType.None}
                                onChange={handleChange}
                            >
                                {Object.keys(CBusinessServiceType).map((key) => {
                                    const typeKey = CBusinessServiceType[key];
                                    return (
                                        <option key={typeKey} value={typeKey}>
                                            {CBusinessServiceTypeDescriptions[typeKey]}
                                        </option>
                                    );
                                })}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formServiceStatus">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={updatedData.status || CBusinessServiceStatus.None}
                                onChange={handleChange}
                            >
                                {Object.keys(CBusinessServiceStatus).map((key) => {
                                    const statusKey = CBusinessServiceStatus[key];
                                    return (
                                        <option key={statusKey} value={statusKey}>
                                            {CBusinessServiceStatusDescription[statusKey]}
                                        </option>
                                    );
                                })}
                            </Form.Control>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <ImageUploadGallery
                                    onImagesUploaded={handleImagesUploaded}
                                    onImagesRemove={handleRemoveImage}
                                    label="Tải ảnh lên"
                                    multiple={false}
                                    returnUrl={true}
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label>Hình ảnh hiện có</Form.Label>
                                <div className="d-flex flex-column align-items-center">
                                    {updatedData.thumbnail ? (
                                        <div className="position-relative mb-3">
                                            <img
                                                src={updatedData.thumbnail}
                                                alt="thumbnail"
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="position-absolute top-0 end-0"
                                                onClick={handleRemoveImage}
                                            >
                                                <FaTimes />
                                            </Button>
                                        </div>
                                    ) : (
                                        <p>Chưa có hình ảnh</p>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Form>
                )}

                {errors.length > 0 && (
                    <div className="alert alert-danger">
                        {errors.map((error, idx) => (
                            <p key={idx}>{error}</p>
                        ))}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>Cập nhật</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BBusinessServiceUpdatePage;
