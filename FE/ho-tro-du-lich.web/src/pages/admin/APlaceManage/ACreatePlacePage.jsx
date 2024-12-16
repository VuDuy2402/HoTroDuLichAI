import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { placeService } from "../../../services/placeService";
import { CPlaceType, PlaceTypeDescriptions } from "../../../enum/placeTypeEnum";
import ImageUploadGallery from "../../../common/components/UpImage/ImageUploadGallery";
import ErrorField from "@/common/components/ErrorField/ErrorField";
import MapCustom from "../../../common/components/MapCustom/MapCustom";

const ACreatePlacePage = ({ show, onClose, onPlaceCreated }) => {
    const dispatch = useDispatch();
    const [positionMap, setPositionMap] = useState({ latitude: 14.0583, longitude: 108.2772 });
    const [selectedPlaceType, setSelectedPlaceType] = useState(CPlaceType.None);
    const [imageFileIds, setImageFileIds] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isNew, setIsNew] = useState(false);

    const [formValues, setFormValues] = useState({
        name: "",
        description: "",
        address: "",
    });

    const handleImagesUploaded = (fileId) => {
        setImageFileIds((prevFileIds) => [...prevFileIds, fileId]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const createPlaceRequest = {
            name: formValues.name,
            description: formValues.description,
            address: formValues.address,
            isNew: isNew,
            latitude: positionMap.latitude,
            longitude: positionMap.longitude,
            placeType: selectedPlaceType,
            fileIds: imageFileIds,
        };

        try {
            dispatch({ type: "system/enableLoading" });

            const result = await placeService.createPlaceAdmin(createPlaceRequest);

            if (result && result.success) {
                toast.success("Tạo địa điểm thành công.");
                onPlaceCreated();
                onClose();
            } else if (result && result.errors) {
                setErrors(result.errors);
            }
        } catch (error) {
            toast.error(`Lỗi khi đang tạo địa điểm: ${error.message}`);
        } finally {
            dispatch({ type: "system/disableLoading" });
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tạo địa điểm mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên địa điểm</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formValues.name}
                            onChange={handleInputChange}
                            placeholder="Nhập tên địa điểm"
                        />
                        <ErrorField errorList={errors} field="Name_Error" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={formValues.description}
                            onChange={handleInputChange}
                            placeholder="Nhập mô tả địa điểm"
                        />
                        <ErrorField errorList={errors} field="Description_Error" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Loại địa điểm</Form.Label>
                        <Form.Select
                            aria-label="Chọn loại địa điểm"
                            value={selectedPlaceType}
                            onChange={(e) => setSelectedPlaceType(Number(e.target.value))}
                        >
                            {Object.keys(CPlaceType).map((key) => (
                                <option key={CPlaceType[key]} value={CPlaceType[key]}>
                                    {PlaceTypeDescriptions[CPlaceType[key]]}
                                </option>
                            ))}
                        </Form.Select>
                        <ErrorField errorList={errors} field="PlaceType_Error" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formValues.address}
                            onChange={handleInputChange}
                            placeholder="Nhập địa chỉ"
                        />
                        <ErrorField errorList={errors} field="Address_Error" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Địa điểm mới"
                            checked={isNew}
                            onChange={() => setIsNew((prev) => !prev)}
                        />
                    </Form.Group>

                    <MapCustom
                        latitude={positionMap?.latitude}
                        longitude={positionMap?.longitude}
                        label="Location"
                        pin={false}
                        onChangePosition={(data) => setPositionMap(data)}
                    />
                    <ErrorField errorList={errors} field="Longitude_Error" />
                    <ErrorField errorList={errors} field="Latitude_Error" />

                    <ImageUploadSection onImagesUploaded={handleImagesUploaded} />

                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={onClose}>
                            Đóng
                        </Button>
                        <Button variant="primary" type="submit">
                            Tạo địa điểm mới
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

// Image Upload Section Component
const ImageUploadSection = ({ onImagesUploaded }) => (
    <Form.Group className="mb-3">
        <Form.Label>Hình ảnh</Form.Label>
        <ImageUploadGallery onImagesUploaded={onImagesUploaded} />
    </Form.Group>
);

export default ACreatePlacePage;
