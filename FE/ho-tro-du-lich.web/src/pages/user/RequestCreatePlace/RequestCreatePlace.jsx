import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import { systemAction } from "@/redux/slices/systemSlice";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import MapView from "../../../common/components/Map/MapView";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { placeService } from "../../../services/placeService";
import FormErrorAlert from "@/common/components/FormErrorAlert/FormErrorAlert";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import { FaPaperPlane } from "react-icons/fa";
import { toQueryString } from "../../../utils/queryParams";

const RequestCreatePlacePage = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [placeType, setPlaceType] = useState(CPlaceType.None);
    const [fileIds, setFileIds] = useState([]);
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [coordinates, setCoordinates] = useState({ latitude: 14.0583, longitude: 108.2772 });

    const handleCreatePlace = async () => {
        const placeRequest = {
            Description: description,
            Address: address,
            Name: name,
            PlaceType: placeType,
            FileIds: fileIds,
            Latitude: coordinates.latitude,
            Longitude: coordinates.longitude,
        };

        try {
            dispatch(systemAction.enableLoading());
            const response = await placeService.requestCreatePlace(placeRequest);
            if (response && response.success) {
                toast.success(response.data.message);
                const queryString = toQueryString(response.data || {});
                navigate(`/thongbao/?${queryString}`);
            }
            else if (response && response.errors) {
                setErrors(response.errors);
            }
        }
        catch (err) {
            toast.error(`Đã có lỗi xảy ra. ${err}`);
        }
        finally {
            dispatch(systemAction.disableLoading());
        }
    };

    const handleImagesUploaded = (fileId) => {
        setFileIds((prevFileIds) => [...prevFileIds, fileId]);
    };

    return (
        <div className="container">
            <h2 className="d-flex justify-content-center mt-5">Yêu Cầu Tạo Địa Điểm Mới</h2>
            <Form className="my-5">
                <FormErrorAlert errors={errors} />
                <Row className="p-3 rounded mb-3" style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" }}>
                    <Col xs={12} md={6}>
                        <Form.Group controlId="name">
                            <Form.Label>Tên địa điểm</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên địa điểm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <ErrorField errorList={errors} field={"Name_Error"} />
                        </Form.Group>

                        <Form.Group controlId="placeType">
                            <Form.Label>Loại địa điểm</Form.Label>
                            <Form.Control as="select" value={placeType} onChange={(e) => setPlaceType(parseInt(e.target.value))}>
                                {Object.keys(PlaceTypeDescriptions).map((key) => (
                                    <option key={key} value={key}>
                                        {PlaceTypeDescriptions[key]}
                                    </option>
                                ))}
                            </Form.Control>
                            <ErrorField errorList={errors} field={"PlaceType_Error"} />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                        <Form.Group controlId="address">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập địa chỉ của địa điểm"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <ErrorField errorList={errors} field={"Address_Error"} />
                        </Form.Group>

                        <Form.Group controlId="description">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Nhập mô tả về địa điểm"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <ErrorField errorList={errors} field={"Description_Error"} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="p-3 rounded mb-3" style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" }}>
                    <Form.Group controlId="files" className="mt-3">
                        <Form.Label>Tải hình ảnh lên</Form.Label>
                        <ImageUploadGallery onImagesUploaded={handleImagesUploaded} />
                        <ErrorField errorList={errors} field={"FileIds_Error"} />
                    </Form.Group>
                </Row>

                <Row className="p-3 rounded mb-3" style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" }}>
                    <MapView
                        initialCoordinates={coordinates}
                        onCoordinatesChange={setCoordinates}
                    />
                    <ErrorField errorList={errors} field={"Longitude_Error"} />
                    <ErrorField errorList={errors} field={"Latitude_Error"} />
                </Row>

                <Button variant="outline-secondary" onClick={handleCreatePlace} className="mt-3">
                    <FaPaperPlane className="me-2" />
                    Gửi Yêu Cầu
                </Button>
            </Form>
        </div>
    );
};

export default RequestCreatePlacePage;