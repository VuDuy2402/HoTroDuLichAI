import { useEffect, useState } from "react";
import { businessService } from "../../../services/businessService";
import { useLocation, useNavigate } from "react-router-dom";
import RowInfo from "../../../common/components/RowInfo/RowInfo";
import Textarea from "../../../common/components/Textarea/Textarea";
import MapCustom from "../../../common/components/MapCustom/MapCustom";
import { toast } from "react-toastify";
import { CApprovalType, ApprovalTypeDescriptions } from "../../../enum/approvalTypeEnum";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { useDispatch } from "react-redux";
import { systemAction } from "@/redux/slices/systemSlice";

const AConfirmRegisterBusinessPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const businessId = queryParams.get("businessId");
    const [dataDetail, setDataDetail] = useState();
    const [reason, setReason] = useState("");
    const [errors, setErrors] = useState([]);
    const [showReasonForm, setShowReasonForm] = useState(false);

    const handleGetBusinessData = async () => {
        try {         
            dispatch(systemAction.enableLoading());
            const result = await businessService.getBusinessById(businessId);
            if (result) {
                if (result.success) {
                    setDataDetail(result.data);
                } else if (result.errors) {
                    setErrors(result.errors);
                }
            }
        }
        catch (exception) {
            toast.error(`Đã có lỗi xảy ra : ${exception}`);
        }
        finally {
            dispatch(systemAction.disableLoading());
        }
    };

    useEffect(() => {
        handleGetBusinessData();
    }, []);

    const handleApproveOrReject = async (type) => {
        if (type === CApprovalType.Rejected && !reason) {
            setShowReasonForm(true);
            return;
        }

        const data = {
            businessId: businessId,
            approvalType: type,
            reason: reason || "",
        };

        try {
            dispatch(systemAction.enableLoading());
            const result = await businessService.confirmRegisterNewBusiness(data);
            if (result) {
                if (result.success && result.data) {
                    toast.success(result.data.message);
                    navigate("/quantri/diadiem/yeucaudiadiemmoi");
                } else {
                    setErrors(result.errors);
                }
            }
        }
        catch (exception) {
            toast.error(`Đã có lỗi xảy ra. ${exception}`);
        }
        finally {
            dispatch(systemAction.disableLoading());
        }
    };

    return (
        <Container className="frame-business-detail p-2">
            <FormErrorAlert errors={errors} />
            {dataDetail && (
                <>
                    <h5 className="mb-3">Thông tin đăng ký của doanh nghiệp</h5>
                    <RowInfo
                        title={"Approval Status"}
                        info={ApprovalTypeDescriptions[dataDetail.appoved]}
                    />
                    <RowInfo title={"Business Name"} info={dataDetail.businessName} />
                    <RowInfo title={"Address"} info={dataDetail.address} />
                    <Textarea
                        disabled={true}
                        value={dataDetail.businessServiceProperty.description}
                        label={"Business Description"}
                    />
                    <RowInfo title={"Owner"} info={dataDetail.ownerProperty?.fullName} />
                    <RowInfo title={"Email"} info={dataDetail.ownerProperty?.email} />
                    <MapCustom
                        latitude={dataDetail.latitude}
                        longitude={dataDetail.longitude}
                        pin={true}
                        label={"Location"}
                    />
                    
                    {/* Add Contact Information */}
                    <div className="mt-3">
                        <label className="fw-bold">Thông tin người dùng liên hệ</label>
                    </div>
                    <RowInfo title={"Contact Name"} info={dataDetail.businessContactProperty?.name} />
                    <RowInfo title={"Contact Email"} info={dataDetail.businessContactProperty?.email} />
                    <RowInfo title={"Contact Phone"} info={dataDetail.businessContactProperty?.phoneNumber} />
                    <RowInfo title={"Contact Avatar"} info={<img src={dataDetail.businessContactProperty?.avatar} alt="Avatar" width="50" height="50" />} />
                    
                    {/* Province Information */}
                    <RowInfo title={"Province"} info={dataDetail.ProvinceName} />

                    <div className="mt-3">
                        <Row className="mt-3 justify-content-end">
                            <Col xs="auto">
                                <Button
                                    variant="outline-danger"
                                    onClick={() => handleApproveOrReject(CApprovalType.Rejected)}
                                >
                                    <FaTimesCircle className="me-2" />
                                    Từ Chối
                                </Button>
                            </Col>
                            <Col xs="auto">
                                <Button
                                    variant="outline-success"
                                    onClick={() => handleApproveOrReject(CApprovalType.Accepted)}
                                >
                                    <FaCheckCircle className="me-2" />
                                    Chấp Nhận
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {showReasonForm && (
                        <div className="reason-form mt-3">
                            <h6>Vui lòng cung cấp lý do từ chối:</h6>
                            <Textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                label="Lý do từ chối"
                            />
                            <ErrorField errorList={errors} field={"Reason_Error"} />
                            <Row className="mt-2 justify-content-end">
                                <Col xs="auto">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowReasonForm(false)}
                                    >
                                        Hủy
                                    </Button>
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="danger"
                                        onClick={() => handleApproveOrReject(CApprovalType.Rejected)}
                                    >
                                        Xác nhận
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default AConfirmRegisterBusinessPage;
