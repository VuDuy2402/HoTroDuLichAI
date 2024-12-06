import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Badge, Card, Image, Spinner } from "react-bootstrap";
import { FaEye, FaStar, FaImage, FaRoute } from "react-icons/fa";
import { businessService } from "../../../services/businessService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { CBusinessServiceTypeDescriptions } from "../../../enum/businessTypeEnum";
import { ApprovalTypeDescriptions } from "../../../enum/approvalTypeEnum";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const ABusinessDetailPage = ({ show, businessId, onClose }) => {
    const [businessDetails, setBusinessDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorList, setErrors] = useState([]);

    useEffect(() => {
        if (businessId) {
            fetchBusinessDetails(businessId);
        }
    }, [businessId]);

    const fetchBusinessDetails = async (businessId) => {
        setLoading(true);
        try {
            const result = await businessService.getBusinessById(businessId);
            if (result && result.success) {
                setBusinessDetails(result.data);
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    toast.error("Failed to load business details.");
                }
            }
        } catch (error) {
            toast.error("Error fetching business details.");
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <Modal show={show} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết doanh nghiệp</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <Spinner animation="border" />
                        Đang tải dữ liệu...
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <FormErrorAlert errors={errorList} />
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết doanh nghiệp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {businessDetails ? (
                    <div>
                        {/* Statistical Info Section */}
                        <Row className="mb-4">
                            <Col md={3}>
                                <Card className="shadow-sm">
                                    <Card.Body className="text-center">
                                        <FaEye size={30} color="#007bff" />
                                        <h5 className="mt-2">Tổng lượt xem</h5>
                                        <h4>{businessDetails.totalView}</h4>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="shadow-sm">
                                    <Card.Body className="text-center">
                                        <FaStar size={30} color="#ffc107" />
                                        <h5 className="mt-2">Đánh giá</h5>
                                        <h4>Chưa có đánh giá</h4>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="shadow-sm">
                                    <Card.Body className="text-center">
                                        <FaImage size={30} color="#28a745" />
                                        <h5 className="mt-2">Số hình ảnh</h5>
                                        <h4>Chưa có hình ảnh</h4>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="shadow-sm">
                                    <Card.Body className="text-center">
                                        <FaRoute size={30} color="#17a2b8" />
                                        <h5 className="mt-2">Hành trình</h5>
                                        <h4>Chưa có hành trình</h4>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Title & Location Info Section */}
                        <h3>{businessDetails.businessName}</h3>

                        <div className="mb-4">
                            <strong>Địa chỉ: </strong>
                            <span>{businessDetails.address}</span>
                        </div>

                        <div className="mb-4">
                            <strong>Loại doanh nghiệp: </strong>
                            <Badge bg="info" className="ms-2">
                                {CBusinessServiceTypeDescriptions[businessDetails.businessServiceType] || "Loại doanh nghiệp chưa xác định"}
                            </Badge>
                        </div>

                        <div className="mb-4">
                            <strong>Trạng thái duyệt: </strong>
                            <Badge
                                bg={businessDetails.appoved === 1 ? "success" : businessDetails.appoved === 2 ? "danger" : "warning"}
                                className="ms-2"
                            >
                                {ApprovalTypeDescriptions[businessDetails.appoved] || "Chưa duyệt"}
                            </Badge>
                        </div>

                        {/* Owner Info Section */}
                        <div className="d-flex align-items-center mb-4">
                            <Image src={businessDetails.ownerProperty.avatar || "/path/to/default-avatar.jpg"} roundedCircle width={40} height={40} className="me-3" />
                            <div>
                                <strong>{businessDetails.ownerProperty.fullName}</strong>
                                <p className="mb-0 text-muted">{businessDetails.ownerProperty.email}</p>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div style={{ height: "300px", marginBottom: "20px" }}>
                            <MapContainer
                                center={[businessDetails.latitude, businessDetails.longitude]}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker
                                    position={[businessDetails.latitude, businessDetails.longitude]}
                                >
                                    <Popup>{businessDetails.businessName}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>

                        {/* Contact Info Section */}
                        <div className="mb-4">
                            <strong>Người liên hệ: </strong>
                            <div>{businessDetails.businessContactProperty.name}</div>
                            <div>Email: {businessDetails.businessContactProperty.email}</div>
                            <div>Số điện thoại: {businessDetails.businessContactProperty.phoneNumber}</div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">Không có thông tin chi tiết</div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ABusinessDetailPage;