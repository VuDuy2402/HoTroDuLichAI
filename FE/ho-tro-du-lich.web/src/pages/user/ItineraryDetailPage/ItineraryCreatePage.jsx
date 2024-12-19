import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { FaUser, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import useDocumentTitle from "../../../common/js/useDocumentTitle";
import Stepper from "react-stepper-horizontal";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import { itineraryService } from "../../../services/itineraryService";
import { useParams } from 'react-router-dom';
import { aiService } from "../../../services/aiService";

const ItineraryCreatePage = () => {
    const { placeId } = useParams();    
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedNumPeople, setSelectedNumPeople] = useState("");
    const [selectedBudget, setSelectedBudget] = useState("");
    const [selectedNumDays, setSelectedNumDays] = useState("");
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState([]);
    useDocumentTitle('Tạo mới chuyến đi');

    const getAllProvinces = async () => {
        try {
            const provinceResponse = await itineraryService.getAllProvince();
            if (provinceResponse && provinceResponse.success) {
                setProvinces(provinceResponse.data);
            } else if (provinceResponse.errors) {
                setErrors(provinceResponse.errors);
            } else {
                toast.error("Đã có lỗi xảy ra trong quá trình lấy dữ liệu tỉnh.");
            }
        } catch (error) {
            toast.error("Lỗi khi lấy dữ liệu tỉnh.");
        }
    };

    useEffect(() => {
        getAllProvinces();
    }, []);

    const nextStep = () => {
        if (step === 1 && !selectedProvince) {
            setErrors([{ message: "Vui lòng chọn tỉnh." }]);
            return;
        }
        if (step === 2 && (!selectedBudget || !selectedNumPeople || !selectedNumDays)) {
            setErrors([{ message: "Vui lòng chọn đủ thông tin về số người, ngân sách và số ngày." }]);
            return;
        }
        setStep(step + 1);
        if (step === 2)
        {
            getBusinessSuggestion();
        }
        setErrors([]);
    };

    const getBusinessSuggestion = async () => 
    {
        const requestData = {
            placeId: placeId,
            provinceId: selectedProvince,
            peopleCount: Number(selectedNumPeople),
            amount: Number(selectedBudget),
            totalDay: Number(selectedNumDays)
        };
        
        var response = await aiService.getBusinessSuggestion();        

        if (response)
        {
            if (response.success)
            {

            }
            else if (response.errors)
            {
                setErrors(response.errors);
            }
        }
    }

    const prevStep = () => {
        setStep(step - 1);
        setErrors([]);
    };

    const handleSubmit = async () => {
        const requestData = {
            province: selectedProvince,
            budget: selectedBudget,
            numPeople: selectedNumPeople,
            numDays: selectedNumDays,
        };
        try {
            const result = await itineraryService.getItineraryRecommendations(requestData);
            if (result && result.success) {
                console.log(result.data);
                toast.success("Đề xuất chuyến đi đã được tạo!");
            } else {
                toast.error("Không thể tạo đề xuất chuyến đi.");
            }
        } catch (error) {
            toast.error("Lỗi khi lấy đề xuất chuyến đi.");
        }
    };

    const stepTitles = ['Chọn Tỉnh', 'Thông Tin Chuyến Đi', 'Tạo Hành Trình'];

    const numPeopleOptions = [
        { label: "1 Người", value: "1", icon: <FaUser /> },
        { label: "2 Người", value: "2", icon: <FaUser /> },
        { label: "3-7 Người", value: "3-7", icon: <FaUser /> },
        { label: "Trên 7 Người", value: "7+", icon: <FaUser /> }
    ];

    const budgetOptions = [
        { label: "Dưới 5 triệu", value: "<5", icon: <FaMoneyBillWave /> },
        { label: "5 - 10 triệu", value: "5-10", icon: <FaMoneyBillWave /> },
        { label: "10 - 20 triệu", value: "10-20", icon: <FaMoneyBillWave /> },
        { label: "20 - 50 triệu", value: "20-50", icon: <FaMoneyBillWave /> },
        { label: "Trên 50 triệu", value: "50+", icon: <FaMoneyBillWave /> }
    ];

    const numDaysOptions = [
        { label: "1-3 Ngày", value: "1-3", icon: <FaCalendarAlt /> },
        { label: "4-7 Ngày", value: "4-7", icon: <FaCalendarAlt /> },
        { label: "Trên 7 Ngày", value: "7+", icon: <FaCalendarAlt /> }
    ];

    return (
        <div className="container mt-4">
            <FormErrorAlert errors={errors} />
            <Stepper
                steps={stepTitles.map(title => ({ title }))}
                activeStep={step - 1}
                activeColor="#0d6efd"
                completeColor="#198754"
                incompleteColor="#6c757d"
            />

            {step === 1 && (
                <div>
                    <h2>Bước 1: Chọn Tỉnh</h2>
                    <Form.Group controlId="provinceSelect">
                        <Form.Label>Chọn tỉnh</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                        >
                            <option value="">Chọn tỉnh</option>
                            {provinces.map((province) => (
                                <option key={province.provinceId} value={province.provinceId}>
                                    {province.provinceName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h2>Bước 2: Thông Tin Chuyến Đi</h2>
                    <Row>
                        <Col md={4}>
                            <h4>Chọn Số Người</h4>
                            {numPeopleOptions.map((option) => (
                                <Card
                                    key={option.value}
                                    className={`position-relative ${selectedNumPeople === option.value ? "bg-success-subtle" : ""}`}
                                    onClick={() => setSelectedNumPeople(option.value)}
                                >
                                    <Card.Body className="text-center">
                                        <div className="position-absolute top-0 end-0 p-2" style={{ fontSize: '18px' }}>
                                            {option.icon}
                                        </div>
                                        <Card.Title>{option.label}</Card.Title>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>
                        <Col md={4}>
                            <h4>Chọn Ngân Sách</h4>
                            {budgetOptions.map((option) => (
                                <Card
                                    key={option.value}
                                    className={`position-relative ${selectedBudget === option.value ? "bg-success-subtle" : ""}`}
                                    onClick={() => setSelectedBudget(option.value)}
                                >
                                    <Card.Body className="text-center">
                                        <div className="position-absolute top-0 end-0 p-2" style={{ fontSize: '18px' }}>
                                            {option.icon}
                                        </div>
                                        <Card.Title>{option.label}</Card.Title>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>
                        <Col md={4}>
                            <h4>Chọn Số Ngày</h4>
                            {numDaysOptions.map((option) => (
                                <Card
                                    key={option.value}
                                    className={`position-relative ${selectedNumDays === option.value ? "bg-success-subtle" : ""}`}
                                    onClick={() => setSelectedNumDays(option.value)}
                                >
                                    <Card.Body className="text-center">
                                        <div className="position-absolute top-0 end-0 p-2" style={{ fontSize: '18px' }}>
                                            {option.icon}
                                        </div>
                                        <Card.Title>{option.label}</Card.Title>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>
                    </Row>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h2>Đang Tạo Hành Trình</h2>
                    <p>Đang xử lý dữ liệu...</p>
                </div>
            )}

            <div className="mt-3">
                {step > 1 && (
                    <Button variant="secondary" onClick={prevStep}>
                        Quay lại
                    </Button>
                )}
                {step < 3 ? (
                    <Button variant="primary" onClick={nextStep}>
                        Tiếp theo
                    </Button>
                ) : (
                    <Button variant="success" onClick={handleSubmit}>
                        Tạo Hành Trình
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ItineraryCreatePage;
