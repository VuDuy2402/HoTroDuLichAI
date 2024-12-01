import { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Badge, Card, Image, Spinner } from "react-bootstrap";
import { FaEye, FaStar, FaImage, FaRoute } from "react-icons/fa";
import { placeService } from "../../../services/placeService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import { ApprovalTypeDescriptions } from "../../../enum/approvalTypeEnum";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const APlaceDetailPage = ({ show, placeId, onClose }) => {
    const [placeDetails, setPlaceDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorList, setErrors] = useState([]);

    useEffect(() => {
        if (placeId) {
            fetchPlaceDetails(placeId);
        }
    }, [placeId]);

    const fetchPlaceDetails = async (placeId) => {
        setLoading(true);
        try {
            const result = await placeService.getPlaceById(placeId);
            if (result && result.success) {
                setPlaceDetails(result.data);
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    toast.error("Failed to load place details.");
                }
            }
        } catch (error) {
            toast.error("Error fetching place details.");
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <Modal show={show} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết địa điểm</Modal.Title>
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
                <Modal.Title>Chi tiết địa điểm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {placeDetails ? (
                    <div>
                        {/* Statistical Info Section */}
                        <Row className="mb-4">
                            <Col md={3}>
                                <Card className="shadow-sm">
                                    <Card.Body className="text-center">
                                        <FaEye size={30} color="#007bff" />
                                        <h5 className="mt-2">Tổng lượt xem</h5>
                                        <h4>{placeDetails.totalView}</h4>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="shadow-sm">
                                    <Card.Body className="text-center">
                                        <FaStar size={30} color="#ffc107" />
                                        <h5 className="mt-2">Đánh giá</h5>
                                        <h4>{placeDetails.rating}</h4>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="shadow-sm">
                                    <Card.Body className="text-center">
                                        <FaImage size={30} color="#28a745" />
                                        <h5 className="mt-2">Số hình ảnh</h5>
                                        <h4>{placeDetails.imageDetailProperties.length}</h4>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="shadow-sm">
                                    <Card.Body className="text-center">
                                        <FaRoute size={30} color="#17a2b8" />
                                        <h5 className="mt-2">Hành trình</h5>
                                        <h4>{placeDetails.totalUseItinerary}</h4>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Title & Location Info Section */}
                        <h3>{placeDetails.name}</h3>

                        <div className="mb-4">
                            <strong>Loại địa điểm: </strong>
                            <Badge
                                bg="info"
                                className="ms-2"
                            >
                                {PlaceTypeDescriptions[placeDetails.placeType] || "Loại địa điểm chưa xác định"}
                            </Badge>
                        </div>

                        <div className="mb-4">
                            <strong>Là địa điểm mới: </strong>
                            <Badge
                                className="ms-2"
                            >
                                {placeDetails.isNew ? "Mới" : ""}
                            </Badge>
                        </div>

                        {/* Approval Status */}
                        <div className="mb-4">
                            <strong>Trạng thái duyệt: </strong>
                            <Badge
                                bg={placeDetails.approvalType === 1 ? "success" : placeDetails.approvalType === 2 ? "danger" : "warning"}
                                className="ms-2"
                            >
                                {ApprovalTypeDescriptions[placeDetails.approvalType]}
                            </Badge>
                        </div>

                        {/* Owner Info Section */}
                        <div className="d-flex align-items-center mb-4">
                            <Image src={placeDetails.ownerProperty.avatar} roundedCircle width={40} height={40} className="me-3" />
                            <div>
                                <strong>{placeDetails.ownerProperty.fullName}</strong>
                                <p className="mb-0 text-muted">{placeDetails.ownerProperty.email}</p>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div style={{ height: "300px", marginBottom: "20px" }}>
                            <MapContainer
                                center={[placeDetails.latitude, placeDetails.longtitude]}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker
                                    position={[placeDetails.latitude, placeDetails.longtitude]}
                                >
                                    <Popup>{placeDetails.name}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>

                        {/* Gallery Section */}
                        {placeDetails.imageDetailProperties && placeDetails.imageDetailProperties.length > 0 && (
                            <div>
                                <h5>Ảnh Gallery</h5>
                                <Row>
                                    {placeDetails.imageDetailProperties.map((image, index) => (
                                        <Col md={3} key={index} className="mb-3">
                                            <Image
                                                src={image.url}
                                                alt={`image-${index}`}
                                                fluid
                                                style={{ objectFit: "cover", height: "200px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
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

export default APlaceDetailPage;