import { Button, Form, Modal, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { systemAction } from "../../../redux/slices/systemSlice";
import { businessService } from "../../../services/businessService";
import { CBusinessServiceType, CApprovalType, CBusinessServiceTypeDescriptions, CApprovalTypeDescription } from "../../../enum/businessTypeEnum";
import MapCustom from "../../../common/components/MapCustom/MapCustom";
import { itineraryService } from "../../../services/itineraryService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";

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
                toast.success("Business updated successfully.");
                onBusinessUpdated();
                onClose();
            } else if (result && result.errors) {
                setErrors(result.errors);
            }
        } catch (error) {
            toast.error("Error updating business:", error);
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
                                    <Form.Label>Business Name</Form.Label>
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
                                    <Form.Label>Address</Form.Label>
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
                            <Form.Label>Province</Form.Label>
                            <Form.Select
                                name="provinceId"
                                defaultValue={businessDetail.provinceId}
                            >
                                <option value="">Select Province</option>
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
                                    <Form.Label>Business Type</Form.Label>
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
                                    <Form.Label>Approval Status</Form.Label>
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


                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Name</Form.Label>
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
                                    <Form.Label>Email</Form.Label>
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
                                    <Form.Label>Phone Number</Form.Label>
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

                        <Row>
                            {serviceProperties.map((service, index) => (
                                <Col md={4} key={service.ServiceId}>
                                    <Card key={index}>
                                        <Card.Body>
                                            <Card.Title>{service.Name}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{service.Type}</Card.Subtitle>
                                            <Card.Text>
                                                <strong>Amount:</strong> {service.Amount} <br />
                                                <strong>Status:</strong> {service.Status} <br />
                                                <strong>Quantity:</strong> {service.Quantity}
                                            </Card.Text>
                                            <Button
                                                variant="primary"
                                                onClick={() => setSelectedService(service)}
                                            >
                                                Edit
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {selectedService && (
                            <Modal show={true} onHide={() => setSelectedService(null)} size="lg" centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Service: {selectedService.Name}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form
                                        onSubmit={(e) => handleUpdateService(e, selectedService.ServiceId)}
                                    >
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Service Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        defaultValue={selectedService.Name}
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
                                                    <Form.Label>Status</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={selectedService.Status}
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
                                                    <Form.Label>Amount</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={selectedService.Amount}
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
                                                    <Form.Label>Quantity</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={selectedService.Quantity}
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
                                                    <Form.Label>Thumbnail URL</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={selectedService.Thumbnail}
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
                                                Cancel
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                Save Changes
                                            </Button>
                                        </div>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                        )}


                        <div className="d-flex justify-content-end mt-3">
                            <Button variant="secondary" onClick={onClose} className="me-2">Cancel</Button>
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                Confirm
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

export default AUpdateBusinessPage;