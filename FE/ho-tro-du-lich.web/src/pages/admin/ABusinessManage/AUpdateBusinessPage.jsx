import { Button, Form, Modal, Row, Col, Card, Badge, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { systemAction } from "../../../redux/slices/systemSlice";
import { businessService } from "../../../services/businessService";
import { CBusinessServiceType, CApprovalType, CBusinessServiceTypeDescriptions, CApprovalTypeDescription, CBusinessServiceStatus } from "../../../enum/businessTypeEnum";
import MapCustom from "../../../common/components/MapCustom/MapCustom";
import { itineraryService } from "../../../services/itineraryService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { FaSyncAlt } from "react-icons/fa"
import { CStatusType, CStatusTypeDescription } from "../../../enum/statusTypeEnum";

const AUpdateBusinessPage = ({ show, onClose, businessId, onBusinessUpdated }) => {
    const [positionMap, setPositionMap] = useState(null);
    const [provinceList, setProvinceList] = useState([]);
    const [businessDetail, setBusinessDetail] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState(CBusinessServiceType.None);
    const [selectedApprovalType, setSelectedApprovalType] = useState(CApprovalType.None);
    const [errors, setErrors] = useState([]);
    const dispatch = useDispatch();
    const [serviceProperties, setServiceProperties] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [businessContact, setBusinessContact] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        avatar: '',
    });

    useEffect(() => {
        if (businessId && show) {
            fetchBusinessDetail();
        }
    }, [businessId, show]);

    const fetchBusinessDetail = async () => {
        dispatch(systemAction.enableLoading());
        try {
            const result = await businessService.getBusinessForUpdateById(businessId);
            if (result && result.success) {
                setBusinessDetail(result.data);
                setSelectedServiceType(result.data.businessServiceType || CBusinessServiceType.None);
                setSelectedApprovalType(result.data.appoved || CApprovalType.None);
                setServiceProperties(result.data.serviceProperties);
                setBusinessContact(result.data.businessContactProperty);
                setPositionMap({
                    latitude: result.data.latitude,
                    longitude: result.data.longitude
                });
            } else if (result && result.errors) {
                toast.error(result.errors);
            }
        } catch (error) {
            toast.error("Error fetching business details:", error);
        } finally {
            dispatch(systemAction.disableLoading());
        }
    };

    const handleGetAllProvince = async () => {
        try {
            dispatch(systemAction.enableLoading());
            const result = await itineraryService.getAllProvince();
            if (result && result.success) {
                const listConvert = result.data.map((item) => ({
                    label: item.provinceName,
                    value: item.provinceId,
                }));
                setProvinceList(listConvert);
            } else if (result && result.errors) {
                setErrors(result.errors);
            }
        } catch (err) {
            toast.error(`Error occurred: ${err}`);
        } finally {
            dispatch(systemAction.disableLoading());
        }
    };

    useEffect(() => {
        handleGetAllProvince();
    }, []);

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);
        dispatch(systemAction.enableLoading());

        const updatedData = {
            BusinessId: businessId,
            BusinessName: e.target.businessName.value,
            Address: e.target.address.value,
            BusinessServiceType: selectedServiceType,
            Appoved: selectedApprovalType,
            Longitude: positionMap?.longitude,
            Latitude: positionMap?.latitude,
            ProvinceId: e.target.provinceId.value,
            BusinessContactProperty: businessContact,
            FileId: e.target.fileId?.value
        };

        try {
            const result = await businessService.updateBusinesseAdmin(updatedData);
            if (result && result.success) {
                toast.success(result.data.message);
                onBusinessUpdated();
                onClose();
            } else if (result && result.errors) {
                setErrors(result.errors);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi:", error);
        } finally {
            setIsSubmitting(false);
            dispatch(systemAction.disableLoading());
        }
    };

    const handleUpdateService = (e, serviceId) => {
        e.preventDefault();
        const updatedServiceProperties = serviceProperties.map((service) =>
            service.ServiceId === serviceId
                ? { ...service, ...selectedService }
                : service
        );
        setServiceProperties(updatedServiceProperties);
        setSelectedService(null);
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Business Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {businessDetail ? (
                    <Form onSubmit={handleSubmitUpdate}>
                        <FormErrorAlert errors={errors} />
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên doanh nghiệp</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="businessName"
                                        defaultValue={businessDetail.businessName}
                                    />
                                </Form.Group>
                                <ErrorField errorList={errors} field={"BusinessName_Error"} />
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        defaultValue={businessDetail.address}
                                    />
                                </Form.Group>
                                <ErrorField errorList={errors} field={"Address_Error"} />
                            </Col>
                        </Row>

                        <Form.Group controlId="provinceId" className="my-2">
                            <Form.Label>Tỉnh</Form.Label>
                            <Form.Select
                                name="provinceId"
                                defaultValue={businessDetail.provinceId}
                            >
                                <option value="">Chọn tỉnh</option>
                                {provinceList.map((province) => (
                                    <option key={province.value} value={province.value}>
                                        {province.label}
                                    </option>
                                ))}
                            </Form.Select>
                            <ErrorField errorList={errors} field="ProvinceId_Error" />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại doanh nghiệp</Form.Label>
                                    <Form.Select
                                        value={selectedServiceType}
                                        onChange={(e) => setSelectedServiceType(Number(e.target.value))}
                                    >
                                        {Object.keys(CBusinessServiceType).map((key) => (
                                            <option key={key} value={CBusinessServiceType[key]}>
                                                {CBusinessServiceTypeDescriptions[CBusinessServiceType[key]]}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <ErrorField errorList={errors} field={"BusinessServiceType_Error"} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tình trạng phê duyệt</Form.Label>
                                    <Form.Select
                                        value={selectedApprovalType}
                                        onChange={(e) => setSelectedApprovalType(Number(e.target.value))}
                                    >
                                        {Object.keys(CApprovalType).map((key) => (
                                            <option key={key} value={CApprovalType[key]}>
                                                {CApprovalTypeDescription[CApprovalType[key]]}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <ErrorField errorList={errors} field={"approved_Error"} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <MapCustom
                                latitude={positionMap?.latitude}
                                longitude={positionMap?.longitude}
                                label="Location"
                                pin={false}
                                onChangePosition={(data) => setPositionMap(data)}
                            />
                            <ErrorField errorList={errors} field={"Longitude_Error"} />
                            <ErrorField errorList={errors} field={"Latitude_Error"} />
                        </Row>


                        <div className="my-4 p-2 rounded border">
                            <Row className="">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên người liên hệ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={businessContact.name}
                                            onChange={(e) => setBusinessContact({ ...businessContact, name: e.target.value })}
                                        />
                                    </Form.Group>
                                    <ErrorField errorList={errors} field={"ContactName_Error"} />
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email người liên hệ</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={businessContact.email}
                                            onChange={(e) => setBusinessContact({ ...businessContact, email: e.target.value })}
                                        />
                                    </Form.Group>
                                    <ErrorField errorList={errors} field={"Email_Error"} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={businessContact.phoneNumber}
                                            onChange={(e) => setBusinessContact({ ...businessContact, phoneNumber: e.target.value })}
                                        />
                                    </Form.Group>
                                    <ErrorField errorList={errors} field={"PhoneNumber_Error"} />
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Avatar</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={businessContact.avatar}
                                            onChange={(e) => setBusinessContact({ ...businessContact, avatar: e.target.value })}
                                        />
                                    </Form.Group>
                                    <ErrorField errorList={errors} field={"Avatar_Error"} />
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            {serviceProperties.map((service, index) => (
                                <Col md={4} key={service.serviceId}>
                                    <BusinessServiceItem service={service} onClick={() => setSelectedService(service)} />
                                </Col>
                            ))}
                        </Row>

                        {selectedService && (
                            <Modal show={true} onHide={() => setSelectedService(null)} size="lg" centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Cập nhật dịch vụ: {selectedService.name}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form
                                        onSubmit={(e) => handleUpdateService(e, selectedService.serviceId)}
                                    >
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Tên dịch vụ</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        defaultValue={selectedService.name}
                                                        onChange={(e) =>
                                                            setSelectedService({
                                                                ...selectedService,
                                                                Name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Trạng thái</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={selectedService.status}
                                                        onChange={(e) =>
                                                            setSelectedService({
                                                                ...selectedService,
                                                                Status: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Inactive">Inactive</option>
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Giá</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={selectedService.amount}
                                                        onChange={(e) =>
                                                            setSelectedService({
                                                                ...selectedService,
                                                                Amount: parseFloat(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Số lượng</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={selectedService.quantity}
                                                        onChange={(e) =>
                                                            setSelectedService({
                                                                ...selectedService,
                                                                Quantity: parseInt(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Hình ảnh</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={selectedService.thumbnail}
                                                        onChange={(e) =>
                                                            setSelectedService({
                                                                ...selectedService,
                                                                Thumbnail: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setSelectedService(null)}
                                                className="me-2"
                                            >
                                                Hủy
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                Lưu
                                            </Button>
                                        </div>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                        )}


                        <div className="d-flex justify-content-end mt-3">
                            <Button variant="secondary" onClick={onClose} className="me-2">Hủy</Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                Xác nhận
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <div>Loading business details...</div>
                )}
            </Modal.Body>
        </Modal>
    );
};



const BusinessServiceItem = ({ service, onClick }) => {
    return (
        <Card className="my-3">
            <Card.Body>
                <Row>
                    <Col>
                        <Image src={service.thumbnail} alt={service.name} fluid />
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col>
                        <Card.Title style={{ fontSize: "12px" }}>{service.name}</Card.Title>
                        {/* <Card.Subtitle className="text-muted small" style={{ fontSize: "10px" }}>Mã dịch vụ: {service.serviceId}</Card.Subtitle> */}
                        <Row className="mb-2" style={{ fontSize: "10px" }}>
                            <Col>
                                <span>Trạng thái : </span>
                                <Badge bg={service.status === CBusinessServiceStatus.Available ? 'success' : 'danger'}>
                                    {CStatusTypeDescription[service.status]}
                                </Badge>
                            </Col>
                            <Col>
                                <span>Dịch vụ : </span>
                                <Badge variant="primary">
                                    {CBusinessServiceTypeDescriptions[service.type]}
                                </Badge>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                                <Card.Text style={{ fontSize: "10px" }}>Số lượng: {service.quantity}</Card.Text>
                            </Col>
                            <Col>
                                <Card.Text style={{ fontSize: "10px" }}>Số tiền: {service.amount.toLocaleString()} VND</Card.Text>
                            </Col>
                        </Row>
                        <button className="btn btn-sm btn-outline-success text-end" onClick={onClick}>
                            <FaSyncAlt className="mr-2" /> Cập nhật
                        </button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default AUpdateBusinessPage;