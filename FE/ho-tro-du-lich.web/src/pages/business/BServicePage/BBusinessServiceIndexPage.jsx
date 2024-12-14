import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { systemAction } from "../../../redux/slices/systemSlice";
import { businessService } from "../../../services/businessService";
import { userService } from "../../../services/userSerivce";
import useDocumentTitle from "../../../common/js/useDocumentTitle";
import { toast } from "react-toastify";
import { Card, Row, Col, Spinner, Button, Badge } from 'react-bootstrap';
import { FaEllipsisV, FaPlus } from 'react-icons/fa';
import { CBusinessServiceStatusDescription, CBusinessServiceTypeDescriptions } from "../../../enum/businessTypeEnum";
import BBusinessServiceUpdatePage from "./BBusinessServiceUpdatePage";
import BBusinessServiceCreatePage from "./BBusinessServiceCreatePage";

const BBusinessServiceIndexPage = () => {
    const [errors, setErrors] = useState([]);
    const [businessId, setBusinessId] = useState(null);
    const [businessServiceData, setBusinessServiceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const dispatch = useDispatch();
    useDocumentTitle('Dịch vụ doanh nghiệp');

    const getBusinessServices = async () => {
        setLoading(true);
        dispatch(systemAction.enableLoading());
        try {
            const myBusinessResponse = await userService.getMyBusiness();
            if (myBusinessResponse && myBusinessResponse.success) {
                setBusinessId(myBusinessResponse.data.id);
            } else {
                setErrors(myBusinessResponse.errors || []);
            }

            const businessServiceResponse = await businessService.getBusinessServices(myBusinessResponse.data.id);
            if (businessServiceResponse && businessServiceResponse.success) {
                setBusinessServiceData(businessServiceResponse.data);
            } else {
                setErrors(businessServiceResponse.errors || []);
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
            dispatch(systemAction.disableLoading());
        }
    };

    useEffect(() => {
        getBusinessServices();
    }, []);

    const handleUpdate = (service) => {
        setSelectedService(service);
        setShowUpdateModal(true);
    };

    const handleDelete = (serviceId) => {
        console.log(`Deleting service: ${serviceId}`);
    };

    const toggleDropdown = (serviceId) => {
        setIsDropdownOpen((prevState) => (prevState === serviceId ? null : serviceId));
    };

    const handleUpdateSuccess = () => {
        getBusinessServices();
    };

    const handleCreateSuccess = () => {
        getBusinessServices();
        setShowCreateModal(false);
    };

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between mb-3">
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    <FaPlus /> Tạo mới dịch vụ
                </Button>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {businessServiceData.length > 0 ? (
                        businessServiceData.map((service) => (
                            <Col key={service.serviceId}>
                                <Card className="position-relative">
                                    <Card.Img variant="top" src={service.thumbnail} alt={service.name} />
                                    <Card.Body>
                                        <Card.Title>{service.name}</Card.Title>
                                        <Card.Text>
                                            <strong>Trạng thái : </strong> <Badge> {CBusinessServiceStatusDescription[service.status]}</Badge><br />
                                            <strong>Loại dịch vụ : </strong><Badge>{CBusinessServiceTypeDescriptions[service.type]}</Badge><br />
                                            <strong>Giá : </strong> {service.amount} <small className="text-secondary">VNĐ</small><br />
                                            <strong>Số lượng : </strong> {service.quantity}
                                        </Card.Text>
                                    </Card.Body>

                                    <div className="position-absolute top-0 end-0">
                                        <button
                                            className="p-0 btn btn-sm btn-warning"
                                            onClick={() => toggleDropdown(service.serviceId)}
                                        >
                                            <FaEllipsisV size={15} />
                                        </button>

                                        {isDropdownOpen === service.serviceId && (
                                            <div className="position-absolute top-0 end-0 mt-2">
                                                <div className="dropdown-menu show">
                                                    <Button variant="link" className="dropdown-item" onClick={() => handleUpdate(service)}>
                                                        Cập nhật
                                                    </Button>
                                                    <Button variant="link" className="dropdown-item" onClick={() => handleDelete(service.serviceId)}>
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No services found</p>
                    )}
                </Row>
            )}

            {showUpdateModal && selectedService && (
                <BBusinessServiceUpdatePage
                    show={showUpdateModal}
                    businessId={businessId}
                    onHide={() => setShowUpdateModal(false)}
                    service={selectedService}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}

            {showCreateModal && (
                <BBusinessServiceCreatePage
                    show={showCreateModal}
                    businessId={businessId}
                    onHide={() => setShowCreateModal(false)}
                    onCreateSuccess={handleCreateSuccess}
                />
            )}
        </div>
    );
};

export default BBusinessServiceIndexPage;